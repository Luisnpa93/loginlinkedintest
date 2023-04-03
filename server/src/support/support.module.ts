import { Module } from '@nestjs/common';
import { EmailVerificationService } from 'src/email_verification_service/email.service';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';


@Module({
  controllers: [SupportController],
  providers: [SupportService, EmailVerificationService],
})
export class SupportModule {}
