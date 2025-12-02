import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
    const user = await this.usersService.findByEmail(email);
      if (!user) {
        console.log(`User not found: ${email}`);
        return null;
      }
      if (!user.password) {
        console.log(`User has no password: ${email}`);
        return null;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
      const { password: _, ...result } = user;
      return result;
    }
      console.log(`Invalid password for user: ${email}`);
      return null;
    } catch (error) {
      console.error('Error in validateUser:', error);
    return null;
    }
  }

  async login(user: any, ipAddress?: string, userAgent?: string) {
    if (!user || !user.id || !user.email) {
      throw new UnauthorizedException('Invalid user data');
    }
    return this.generateTokens(user, ipAddress, userAgent);
  }

  async register(
  email: string,
  password: string,
  name?: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const existingUser = await this.usersService.findByEmail(email);
  if (existingUser) {
    throw new UnauthorizedException('this Arm is already alive');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await this.usersService.create(email, hashedPassword, name);
  
  // Générer le token de vérification d'email
  const verificationToken = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Expire dans 24h
  
  // Mettre à jour l'utilisateur avec le token
  await this.usersService.update(user.id, {
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpires: expiresAt,
    emailVerified: false,
  });
  
  const { password: _, ...result } = user;
  const loginResult = await this.generateTokens(result, ipAddress, userAgent);
  return { 
    ...loginResult,
    verificationToken, // À retirer quand on aura un vrai service d'email
  }
}

  async generateTokens(user: any, ipAddress?: string, userAgent?: string) {
    const accessPayload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(accessPayload);
    const expiresAt = new Date();
    const refresh_token = randomBytes(64).toString('hex');
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Créer et sauvegarder l'entité RefreshToken
    const refreshTokenEntity = new RefreshToken();
    refreshTokenEntity.token = refresh_token;
    refreshTokenEntity.userId = user.id;
    refreshTokenEntity.expiresAt = expiresAt;
    refreshTokenEntity.ipAddress = ipAddress || null;
    refreshTokenEntity.userAgent = userAgent || null;
    refreshTokenEntity.lastUsedAt = new Date();

    await this.refreshTokenRepository.save(refreshTokenEntity);
    
    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });
    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (new Date() > tokenEntity.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    tokenEntity.lastUsedAt = new Date();
    await this.refreshTokenRepository.save(tokenEntity);

    const accessPayload = {
      email: tokenEntity.user.email,
      sub: tokenEntity.user.id,
    };
    const access_token = this.jwtService.sign(accessPayload);

    return { access_token };
  }

  async revokeRefreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });
    
    // Si le token n'existe pas, on retourne quand même un succès (idempotent)
    if (!tokenEntity) {
      return { message: 'Refresh token revoked successfully' };
    }
    
    // Supprimer le token de la base
    await this.refreshTokenRepository.delete({ token: refreshToken });
    
    return { message: 'Refresh token revoked successfully' };
  }

  async getUserSessions(userId: string) {
    const sessions = await this.refreshTokenRepository.find({
      where: { userId },
      order: { lastUsedAt: 'DESC' },
    });
    return sessions.map((session) => ({
        id: session.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
        isExpired: new Date() > session.expiresAt,
    }));
  }

  async revokeSession(sessionId: string, userId: string) {
    const session = await this.refreshTokenRepository.findOne({
        where: { id: sessionId, userId },
    });
    if (!session) {
        throw new UnauthorizedException('Session not found');
    }
    await this.refreshTokenRepository.delete({ id: sessionId });
    return { message: 'Session revoked successfully' };
  }

  async revokeAllOtherSessions(sessionId: string, userId: string) {
  const allSessions = await this.refreshTokenRepository.find({
    where: { userId },
  });
  
    const sessionsToDelete = allSessions.filter((s) => s.id !== sessionId);
  if (sessionsToDelete.length > 0) {
    await this.refreshTokenRepository.remove(sessionsToDelete);
  }
  
  return { message: 'All other sessions revoked successfully' };
}
async verifyEmail(token: string) {
  const user = await this.usersService.findByEmailVerificationToken(token);
  
  if (!user) {
    throw new UnauthorizedException('Invalid verification token');
  }
  
  if (user.emailVerified) {
    throw new UnauthorizedException('Email already verified');
  }
  
  if (user.emailVerificationTokenExpires && new Date() > user.emailVerificationTokenExpires) {
    throw new UnauthorizedException('Verification token expired');
  }
  
  // Marquer l'email comme vérifié et supprimer le token
  await this.usersService.update(user.id, {
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationTokenExpires: null,
  });
  
  return { message: 'Email verified successfully' };
}
async resendVerificationEmail(email: string) {
  const user = await this.usersService.findByEmail(email);
  
  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  
  if (user.emailVerified) {
    throw new UnauthorizedException('Email already verified');
  }
  
  // Générer un nouveau token
  const verificationToken = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  await this.usersService.update(user.id, {
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpires: expiresAt,
  });
  
  // Pour l'instant, on retourne le token (plus tard on l'enverra par email)
  return { 
    message: 'Verification email sent',
    token: verificationToken, // À retirer quand on aura un vrai service d'email
  };
}
async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
        return { message: 'If that email is registered, a password reset link has been sent.' };
    }
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await this.usersService.update(user.id, {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: expiresAt,
    });
    return { 
        message: 'Password reset link has been sent.',
        token: resetToken, // À retirer quand on aura un vrai service d'email
    };
}
async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByPasswordResetToken(token);
    if (!user) {
        throw new UnauthorizedException('Invalid password reset token');
    }
    if (user.passwordResetTokenExpires && new Date() > user.passwordResetTokenExpires) {
        throw new UnauthorizedException('Password reset token expired');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
    });
    return { message: 'Password has been reset successfully' };
}
async googleLogin(user: any, ipAddress?: string, userAgent?: string) {
  if (!user || !user.email) {
    throw new UnauthorizedException('Invalid Google user data');
  }

  // Chercher si l'utilisateur existe déjà
  let dbUser = await this.usersService.findByEmail(user.email);

  if (!dbUser) {
    // Créer un nouvel utilisateur avec Google
    const name = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.firstName || user.lastName || null;
    
    dbUser = await this.usersService.create(
      user.email,
      '', // Pas de mot de passe pour les utilisateurs OAuth
      name,
    );

    // Marquer l'email comme vérifié (Google l'a déjà vérifié)
    await this.usersService.update(dbUser.id, {
      emailVerified: true,
      avatar: user.picture || null,
    });
  } else {
    // Mettre à jour l'avatar si nécessaire
    if (user.picture && !dbUser.avatar) {
      await this.usersService.update(dbUser.id, {
        avatar: user.picture,
      });
    }
  }

  const { password: _, ...result } = dbUser;
  return this.generateTokens(result, ipAddress, userAgent);
}
}