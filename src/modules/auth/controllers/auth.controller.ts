import { Controller, Post, Body, Res, UseGuards } from "@nestjs/common"
import { LoginDto, RegisterUserEmployeeDto } from "../dto/auth.dto"
import { AuthService } from "../services/auth.service"
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guards"


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: LoginDto, @Res() res:any) {
        try {
            const data = await this.authService.login(body.employee_id, body.password)
            return res.status(201).json({
                message: 'success',
                data
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                message: error.message
            })
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    async register(@Body() body: RegisterUserEmployeeDto, @Res() res:any) {
        try {
            const data = await this.authService.registerUserEmployee(body.employee_id, body.password)
            return res.status(201).json({
                message: 'success',
                data
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }
}