import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { User } from '../entities/user.entity'

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Admin, (admin) => admin.role)
  admins: Admin[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}