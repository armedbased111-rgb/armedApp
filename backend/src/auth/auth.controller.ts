import { Controller, Post, Body, UnauthorizedException, Request, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
  @Body() loginDto: { email: string; password: string },
  @Request() req,
) {
  try {
  if (!loginDto.email || !loginDto.password) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.authService.login(user, ipAddress, userAgent);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    console.error('Login error:', error);
    throw new UnauthorizedException('Login failed');
  }
}

  @Post('register')
  async register(
    @Body() registerDto: { email: string; password: string; name?: string },
    @Request() req,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      ipAddress,
      userAgent,
    );
  }
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
    throw new UnauthorizedException('Refresh Token is required');
    }
    return this.authService.refreshAccessToken(body.refresh_token);
  }
  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
    throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.revokeRefreshToken(body.refresh_token);
  }
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Request() req) {
    const userId = req.user.userId;
    return this.authService.getUserSessions(userId);
  }
  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.authService.revokeSession(sessionId, userId);
  }
  @Delete('sessions')
  @UseGuards(JwtAuthGuard)
  async revokeOtherSessions(
    @Request() req,
    @Body() body: { currentSessionId?: string },
  ) {
    const userId = req.user.userId;
    if (!body.currentSessionId) {
        throw new UnauthorizedException('Current session ID is required to revoke all other sessions');
    }
    return this.authService.revokeAllOtherSessions(body.currentSessionId, userId);
  }
  @Get('verify-email/:token')
    async verifyEmail(@Param('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('resend-verification')
async resendVerification(@Body() body: { email: string }) {
  if (!body.email) {
    throw new UnauthorizedException('Email is required');
  }
  return this.authService.resendVerificationEmail(body.email);
}
}