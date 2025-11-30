import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const userId = user.userId || user.id;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const unreadOnlyBool = unreadOnly === 'true';

    console.log('NotificationsController: Getting notifications', {
      userId,
      limit: limitNum,
      offset: offsetNum,
      unreadOnly: unreadOnlyBool,
    });

    const result = await this.notificationsService.getByUser(userId, limitNum, offsetNum, unreadOnlyBool);
    
    console.log('NotificationsController: Returning notifications', {
      count: result.notifications.length,
      total: result.total,
    });

    return result;
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: any) {
    const userId = user.userId || user.id;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.userId || user.id;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    const userId = user.userId || user.id;
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }
}

