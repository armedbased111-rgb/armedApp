import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Track } from './track.entity';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
}

@Entity('notifications')
@Index(['userId', 'read']) // Index pour optimiser les requêtes de notifications non lues
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Destinataire de la notification
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // Type de notification
  @Column({ type: 'varchar', length: 20 })
  type: NotificationType;

  // Qui a fait l'action (actor)
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'actorId' })
  actor: User;

  @Column()
  actorId: string;

  // Target (track ou comment concerné, nullable pour FOLLOW)
  @ManyToOne(() => Track, { eager: false, nullable: true })
  @JoinColumn({ name: 'targetId' })
  target: Track;

  @Column({ nullable: true })
  targetId: string | null;

  // Statut de lecture
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
