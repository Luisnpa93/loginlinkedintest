import { Module } from '@nestjs/common';
import { EmailService } from 'src/emailservice/email.service';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';


@Module({
  controllers: [SupportController],
  providers: [SupportService, EmailService],
})
export class SupportModule {}
