import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query('displayName') displayName: string): Promise<string> {
    return this.appService.getHello(displayName);
  }
}
