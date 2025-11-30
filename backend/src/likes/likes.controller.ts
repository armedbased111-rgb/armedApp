import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':trackId')
  async like(
    @Param('trackId') trackId: string,
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const userId = user.userId || user.id;
    return this.likesService.like(userId, trackId);
  }

  @Delete(':trackId')
  async unlike(
    @Param('trackId') trackId: string,
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const userId = user.userId || user.id;
    await this.likesService.unlike(userId, trackId);
    return { message: 'Unliked successfully' };
  }

  @Get(':trackId/status')
  async getStatus(
    @Param('trackId') trackId: string,
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const userId = user.userId || user.id;
    const isLiked = await this.likesService.isLiked(userId, trackId);
    return { isLiked };
  }

  @Get(':trackId')
  async getLikesByTrack(@Param('trackId') trackId: string) {
    return this.likesService.getLikesByTrack(trackId);
  }

  @Get(':trackId/count')
  async getLikeCount(@Param('trackId') trackId: string) {
    const count = await this.likesService.getLikeCount(trackId);
    return { count };
  }
}

