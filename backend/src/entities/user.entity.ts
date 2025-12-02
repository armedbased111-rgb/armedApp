import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // A Hasher plus tard

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  emailVerified: boolean;
  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken: string | null;
  @Column({ nullable: true, type: 'timestamp' })
  emailVerificationTokenExpires: Date | null;
  @Column({ type: 'varchar', nullable: true })
  passwordResetToken: string | null;
  @Column({ nullable: true, type: 'timestamp' })
  passwordResetTokenExpires: Date | null;
}
