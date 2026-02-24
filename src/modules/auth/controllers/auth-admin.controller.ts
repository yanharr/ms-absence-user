import { Controller, Post, Body, Res } from "@nestjs/common"
import { loginDtoAdmin } from "../dto/auth.dto"
import { AuthService } from "../services/auth.service"

@Controller('auth/admin')
export class AuthAdminController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async loginAdmin(@Body() body: loginDtoAdmin, @Res() res:any) {
        try {
            const data = await this.authService.loginAdmin(body.username, body.password)
            return res.status(201).json({
                message: 'success',
                data
            })
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }
}