import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Track } from './track.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  dawType: string; // 'ableton' logic etc

  @Column({ nullable: true })
  dawProjectPath: string; // chemin vers le projet DAW

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Track, (track) => track.project)
  tracks: Track[];

  @CreateDateColumn()
  createdAt: Date;
}
