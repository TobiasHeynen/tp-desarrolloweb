import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.modules.js';
import { GestionModule } from './modules/gestion/gestion.modules.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        synchronize: false,
        autoLoadEntities: true,
        logging: config.get<string>('DB_LOGGING') === 'true',
        logger: 'advanced-console',
      }),
    }),

    AuthModule,
    GestionModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
