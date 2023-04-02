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
import { HasRoleModule } from 'src/role/has-role.module';
import { Role } from 'src/entities/has-role.entity';
import { UserModule } from 'src/user/user-profile.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]), 
    PassportModule,
    HasRoleModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LinkedInStrategy, JwtStrategy, LocalStrategy, EmailVerificationService],
  controllers: [AuthController],
})
export class AuthModule {}
