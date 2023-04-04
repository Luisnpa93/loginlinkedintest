import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/emailservice/email.service';
import { User } from '../entities/user.entity';
import { NewsletterService } from './newsletter.service';
import { NewsletterSubscriptionGuard } from '../guards/newsletter-subscription.guard';
import { NewsletterSubscriptionService } from './newslettersubscription/newslettersubscription.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private newsletterService: NewsletterService,
    private emailService: EmailService,
    private newsletterSubscriptionService: NewsletterSubscriptionService,
  ) {}

  @Post()
  @UseGuards(NewsletterSubscriptionGuard)
  async sendNewsletter(@Body() user: User): Promise<string> {
    const customConfig = await this.newsletterService.getCustomNewsletterConfig();
    const newsletterContent = await this.newsletterService.generateNewsletter(user, customConfig);
    const result = await this.emailService.sendNewsletterEmail(user.email, 'RE.START Newsletter', newsletterContent);
    return `Newsletter sent to ${user.email}: ${result}`;
  }
}

