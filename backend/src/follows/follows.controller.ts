import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowsController {
    constructor(private readonly followsService: FollowsService) {}

    @Post(':userId')
    async follow(
        @Param('userId') userId: string,
        @CurrentUser() user: any,
    ) {
        // Le JWT Strategy retourne { userId, email }
        const currentUserId = user.userId || user.id;
        return this.followsService.follow(currentUserId, userId);
    }

    @Delete(':userId')
    async unfollow(
        @Param('userId') userId: string,
        @CurrentUser() user: any,
    ) {
        // Le JWT Strategy retourne { userId, email }
        const currentUserId = user.userId || user.id;
        await this.followsService.unfollow(currentUserId, userId);
        return { message: 'unfollowed user'};
    }
    
    @Get(':userId/status')
    async getStatus(
        @Param('userId') userId: string,
        @CurrentUser() user: any,
    ) {
        // Le JWT Strategy retourne { userId, email }
        const currentUserId = user.userId || user.id;
        const isFollowing = await this.followsService.isFollowing(currentUserId, userId);
        return { isFollowing };
    }

    @Get(':userId/followers')
    async getFollowers(@Param('userId') userId: string) {
        return this.followsService.getFollowers(userId);
    }

    @Get(':userId/following')
    async getFollowing(@Param('userId') userId: string) {
        return this.followsService.getFollowing(userId);
    }
}