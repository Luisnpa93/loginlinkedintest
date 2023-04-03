import { Controller, Post, Body } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  async submitSupportForm(@Body() supportData: any) {
    console.log(supportData)
    const result = await this.supportService.submitSupportForm(supportData);
    return { success: result };
  }
}