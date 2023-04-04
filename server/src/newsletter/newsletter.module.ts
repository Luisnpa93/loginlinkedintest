import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { EmailService } from '../emailservice/email.service';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService, EmailService],
})
export class NewsletterModule {}
