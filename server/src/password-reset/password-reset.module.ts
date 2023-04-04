import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

import { RedisModule } from '@nestjs-modules/ioredis';
import { EmailService } from 'src/emailservice/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService,EmailService],
})
export class PasswordResetModule {}