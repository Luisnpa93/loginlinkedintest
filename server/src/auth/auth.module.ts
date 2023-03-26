import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LinkedInStrategy } from './linkedin.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'linkedin' }), AuthModule],
  providers: [AuthService, LinkedInStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

