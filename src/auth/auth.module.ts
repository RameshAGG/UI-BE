import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Ensure UsersModule is imported
    PassportModule,
    JwtModule.register({
      secret: 'mySecretKey123!',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController], // This ensures AuthController is mapped
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}





