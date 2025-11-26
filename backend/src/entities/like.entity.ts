import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Track } from './track.entity';

@Entity('likes')
@Unique(['userId', 'trackId'])
export class Like {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: false})
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Track, { eager: false })
    @JoinColumn({ name: 'trackId' })
    track: Track;

    @Column()
    trackId: string;

    @CreateDateColumn()
    createdAt: Date;

}