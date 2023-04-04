import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { NewsletterSubscriptionService } from "../newslettersubscription/newslettersubscription.service";
import { CronJob } from 'cron';
import { NewsletterController } from "../newsletter.controller";

@Injectable()
export class NewsletterSchedulerService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly newsletterSubscriptionService: NewsletterSubscriptionService,
    private readonly newsletterController: NewsletterController,
  ) {}

  async scheduleNewsletter(): Promise<void> {
    const job = new CronJob('0 0 * * 0', async () => {
      const subscribers = await this.newsletterSubscriptionService.getAllSubscribedUsers();
      for (const subscriber of subscribers) {
        await this.newsletterController.sendNewsletter(subscriber);
      }
    });
    this.schedulerRegistry.addCronJob('send-newsletter', job);
  }
}
