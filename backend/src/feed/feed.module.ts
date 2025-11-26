import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Track } from '../entities/track.entity';
import { Project } from '../entities/project.entity';
import { Follow } from '../entities/follow.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Project, Follow, Like, Comment]),
  ],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}

