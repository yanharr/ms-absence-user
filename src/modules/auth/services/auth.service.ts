import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '../entities/user.entity'
import { Role } from '../entities/role.entity'
import { DataSource } from "typeorm";
import { Admin } from "../entities/admin.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,

        private readonly dataSource: DataSource

    ) {}

    async login(employee_id: string, password: string) {
        const employee = await this.userRepository.findOne({
            where: {employee_id: employee_id},
            select: ['id', 'password', 'employee_id'],
            relations: ['role']
        });
        if (!employee) {
            throw new Error('Employee id or password not match')
        }
        
        const valid = await bcrypt.compare(password, employee.password)
        if (!valid) {
            throw new Error('Employee id or password not match')
        }
        const payload = { 
            sub: employee.employee_id,
            role: 'employee'
        }
        const token = this.jwtService.sign(payload, {
            expiresIn: '14d',
        })

        return token

    }

    async registerUserEmployee(employee_id: string, password: string) {
        return await this.dataSource.transaction(async (manager) => {
            const data = await manager.findOne(User, {where: {employee_id}})
            if (data) {
                throw new Error('Employee id exist')
            }

            const role = await this.roleRepository.findOne({ where: { name: 'employee' } });
            if (!role) {
                throw new Error(`Default role 'employee' not found`);
            }

            const user = manager.create(User, {
                employee_id,
                password: await bcrypt.hash(password, 10),
                role: role
            })

            return await manager.save(user)
            }
        )
    } 

    async loginAdmin(username: string, password: string) {
        const data = await this.adminRepository.findOne({where: {name: username}})

        if (!data) {
            throw new Error('Admin not found')
        }
        const valid = await bcrypt.compare(password, data.password)
        if (!valid) {
            throw new Error('admin id and password not match')
        }
        const payload = { 
            sub: data.name,
            is_admin: true,
            role: 'admin'
        }
        const token = this.jwtService.sign(payload, {
            expiresIn: '14d',
        })

        return token
    }
}