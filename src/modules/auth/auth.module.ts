import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '../auth/services/auth.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AuthRabbitConsumerService } from './services/auth-rabbit-consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../auth/entities/user.entity'
import { Role } from '../auth/entities/role.entity'
import { Admin } from '../auth/entities/admin.entity'
import 'dotenv/config'


@Module({
  imports: [
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h'}
    }),
    TypeOrmModule.forFeature([User, Role, Admin])
  ],
  providers: [AuthService, AuthRabbitConsumerService],
  controllers: [AuthController, AuthAdminController],
  exports: [AuthService]
})
export class AuthModule {}