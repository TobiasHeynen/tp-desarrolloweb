import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginDTO } from '../dtos/input/login.dto.js';
import { LoginResponseDTO } from '../dtos/output/login-response.dto.js';
import { AuthService } from '../services/auth.service.js';

@Controller('auth')
export class LoginController {

    constructor(private readonly service: AuthService) {}

    @ApiOkResponse({ type: LoginResponseDTO })
    @Post('login')
    async login(@Body() dto: LoginDTO): Promise<LoginResponseDTO> {
        return await this.service.login(dto);
    }
}
