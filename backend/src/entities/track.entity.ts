import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  fileName: string; // nom du fichier original
  @Column()
  filePath: string; // chemin local du fichier
  @Column({ nullable: true })
  duration: number; // durée en secondes
  @Column({ nullable: true })
  fileSize: number; // taille en bytes

  @ManyToOne(() => Project, (project) => project.tracks)
  @JoinColumn({ name: 'ProjectId' })
  project: Project;

  @Column()
  projectId: string;
  @CreateDateColumn()
  createdAt: Date;
}
