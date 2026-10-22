import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {

    @ApiProperty({ example: '30123456' })
    @IsString()
    @IsNotEmpty()
    documento: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    clave: string;
}
