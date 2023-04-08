import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('arquivos')
export class Arquivo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @Column({ name: 'nome_do_arquivo', length: 255 })
  nomeDoArquivo: string;

  @Column({ name: 'mime_type', length: 64 })
  mimeType: string;

  @Column({ length: 255 })
  bucket: string;

  @Column({ name: 'is_excluido', default: false })
  isExcluido: boolean;

  @Column({ name: 'data_exclusao', nullable: true, type: 'timestamp' })
  dataExclusao: Date | null;

  @ManyToOne(() => User, (user) => user.arquivos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'url', length: 255 })
  url: string;

  @Column({ name: 'tipo', length: 32, nullable: true })
  tipo: string;
}
