import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: { email: string; password: string; name?: string },
  ): Promise<User> {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const currentUserId = user.userId || user.id;
    return this.usersService.getProfile(id, currentUserId);
  }
}
