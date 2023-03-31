import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/constants';
import { PassportModule } from '@nestjs/passport';
import { LinkedInStrategy } from '../strategies/linkedin.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { EmailVerificationService } from 'src/email_verification_service/email.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]), // Import UserRepository here
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LinkedInStrategy, JwtStrategy, LocalStrategy, EmailVerificationService],
  controllers: [AuthController],
})
export class AuthModule {}
