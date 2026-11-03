import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadJwt } from '../interfaces/payload-jwt.interface.js';

export const UsuarioActual = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): PayloadJwt => {
        const request = ctx.switchToHttp().getRequest<{ user: PayloadJwt }>();
        return request.user;
    },
);
