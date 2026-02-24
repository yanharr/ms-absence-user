import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../entities/role.entity'

@Entity('users')
export class User {
 @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employee_id: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}