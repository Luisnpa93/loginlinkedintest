import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';

@Injectable()
export class NewsletterSubscriptionService {
  private subscribers: User[] = [];

  subscribe(user: User): void {
    if (!this.isSubscribed(user)) {
      this.subscribers.push(user);
    }
  }

  unsubscribe(user: User): void {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber.id !== user.id);
  }

  isSubscribed(user: User): boolean {
    return this.subscribers.some((subscriber) => subscriber.id === user.id);
  }

  getAllSubscribedUsers(): User[] {
    return this.subscribers;
  }
}
