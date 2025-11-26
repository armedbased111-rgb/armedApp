import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { Track } from 'src/entities/track.entity';
import { Follow } from 'src/entities/follow.entity';
import { Like } from 'src/entities/like.entity';
import { Comment } from 'src/entities/comment.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, Track, Follow, Like, Comment]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // utilisation dans Authmodule + tard
})
export class UsersModule {}
