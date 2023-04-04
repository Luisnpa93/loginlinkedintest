import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { NewsletterSubscriptionGuard } from "src/guards/newsletter-subscription.guard";
import { NewsletterModule } from "../newsletter.module";
import { NewsletterSubscriptionModule } from "../newslettersubscription/newslettersubscription.module";
import { NewsletterSchedulerService } from "./newsletterschedule.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NewsletterModule,
    NewsletterSubscriptionModule,
  ],
  providers: [NewsletterSchedulerService],
  exports: [NewsletterSchedulerService],
})
export class NewsletterSchedulerModule {}
