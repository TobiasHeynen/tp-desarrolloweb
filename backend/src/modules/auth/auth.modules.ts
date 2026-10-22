import {Module} from '@nestjs/common';
import { LoginController } from './controllers/login.controllers.js';

@Module({
    controllers: [LoginController],
    imports: [],
    providers: [],
    exports: []
})
export class AuthModule {
    
}