import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.admins, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column()
  role_id: number;
}