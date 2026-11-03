import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PayloadJwt } from '../interfaces/payload-jwt.interface.js';

/**
 * Guard que verifica la presencia y validez del token JWT en el encabezado Authorization.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { user?: PayloadJwt }>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Debe iniciar sesión para acceder a este recurso');
        }

        try {
            // Usa el mismo secreto con el que firma el JwtModule (auth.modules.ts)
            const payload = await this.jwtService.verifyAsync<PayloadJwt>(token);
            request.user = payload;
        } catch {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

