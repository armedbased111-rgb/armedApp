import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Follow, User]),
        forwardRef(() => NotificationsModule),
    ],
    controllers: [FollowsController],
    providers: [FollowsService],
    exports: [FollowsService],
})
export class FollowsModule {
}