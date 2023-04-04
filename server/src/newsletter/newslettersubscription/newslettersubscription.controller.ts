import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { NewsletterSubscriptionService } from './newslettersubscription.service';

@Controller('newsletter-subscription')
export class NewsletterSubscriptionController {
  constructor(private newsletterSubscriptionService: NewsletterSubscriptionService) {}

  @Post('subscribe')
  subscribe(@Body() user: User): void {
    this.newsletterSubscriptionService.subscribe(user);
  }

  @Post('unsubscribe')
  unsubscribe(@Body() user: User): void {
    this.newsletterSubscriptionService.unsubscribe(user);
  }
}
