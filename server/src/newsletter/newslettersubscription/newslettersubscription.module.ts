import { Module } from '@nestjs/common';
import { NewsletterSubscriptionController } from './newslettersubscription.controller';
import { NewsletterSubscriptionService } from './newslettersubscription.service';

@Module({
  controllers: [NewsletterSubscriptionController],
  providers: [NewsletterSubscriptionService],
})
export class NewsletterSubscriptionModule {}
