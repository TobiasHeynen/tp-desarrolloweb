import { Body, Controller, NotImplementedException, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginDTO } from '../dtos/input/login.dto.js';
import { LoginResponseDTO } from '../dtos/output/login-response.dto.js';

@Controller('auth')
export class LoginController {

    constructor() {}

    @ApiOkResponse({ type: LoginResponseDTO })
    @Post('login')
    async login(@Body() dto: LoginDTO): Promise<LoginResponseDTO> {
        throw new NotImplementedException();
    }
}
