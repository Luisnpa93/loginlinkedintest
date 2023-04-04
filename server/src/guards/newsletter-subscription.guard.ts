import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NewsletterSubscriptionService } from '../newsletter/newslettersubscription/newslettersubscription.service';

@Injectable()
export class NewsletterSubscriptionGuard implements CanActivate {
  constructor(private readonly newsletterSubscriptionService: NewsletterSubscriptionService) {}

  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      return false;
    }
    return this.newsletterSubscriptionService.isSubscribed(user);
  }
}
