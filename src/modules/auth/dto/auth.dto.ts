import { IsString, MinLength } from 'class-validator'

export class LoginDto {
    @IsString()
    @MinLength(6)
    employee_id: string

    @IsString()
    password: string
    
}

export class RegisterUserEmployeeDto {
    @IsString()
    @MinLength(6)
    employee_id: string

    @IsString()
    password: string
}

export class loginDtoAdmin {
    @IsString()
    @MinLength(6)
    username: string
    
    @IsString()
    password: string
}