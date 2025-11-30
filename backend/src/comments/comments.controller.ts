import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: { trackId: string; content: string },
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const userId = user.userId || user.id;
    return this.commentsService.create(userId, createCommentDto.trackId, createCommentDto.content);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: { content: string },
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const userId = user.userId || user.id;
    return this.commentsService.update(id, userId, updateCommentDto.content);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // Le JWT Strategy retourne { userId, email }
    const userId = user.userId || user.id;
    await this.commentsService.delete(id, userId);
    return { message: 'Comment deleted successfully' };
  }

  @Get('track/:trackId')
  async getByTrack(@Param('trackId') trackId: string) {
    return this.commentsService.getByTrack(trackId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.commentsService.getById(id);
  }

  @Get('track/:trackId/count')
  async getCommentCount(@Param('trackId') trackId: string) {
    const count = await this.commentsService.getCommentCount(trackId);
    return { count };
  }
}

