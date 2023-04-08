import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Arquivo } from './arquivo.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'hash_password', length: 255 })
  hashPassword: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_update' })
  dataUpdate: Date;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'simple-array', default: 'user' })
  perfil: string[];

  @OneToMany(() => Arquivo, (arquivo) => arquivo.user)
  arquivos: Arquivo[];
}
