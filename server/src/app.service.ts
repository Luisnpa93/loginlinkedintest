import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(displayName: string): Promise<string> {
    return Promise.resolve(`Welcome to my app, ${displayName}!`);
  }
}
