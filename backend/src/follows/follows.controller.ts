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
        return this.followsService.follow(user.id, userId);
    }

    @Delete(':userId')
    async unfollow(
        @Param('userId') userId: string,
        @CurrentUser() user: any,
    ) {
        await this.followsService.unfollow(user.id, userId);
        return { message: 'unfollowed user'};
    }
    
    @Get(':userId/status')
    async getStatus(
        @Param('userId') userId: string,
        @CurrentUser() user: any,
    ) {
        const isFollowing = await this.followsService.isFollowing(user.id, userId);
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