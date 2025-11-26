import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('follows')
@Unique(['followerId', 'followingId'])
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'followerId' })
    follower: User;
    @Column()
    followerId: string;
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'followingId' })
    following: User;
    @Column()
    followingId: string;
    @CreateDateColumn()
    createdAt: Date;
}