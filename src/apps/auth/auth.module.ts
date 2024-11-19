import { Module } from '@nestjs/common';
import { AuthController } from './entry-points/api/auth.controller';
import { AuthService } from './domain/services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiryTime') },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
