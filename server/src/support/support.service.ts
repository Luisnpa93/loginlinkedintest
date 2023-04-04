import { Injectable } from '@nestjs/common';
import { EmailService } from '../emailservice/email.service';

@Injectable()
export class SupportService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  async submitSupportForm(supportData: any): Promise<boolean> {
    try {
        await this.emailService.sendSupportEmail(
            supportData.name,
            supportData.email,
            supportData.message,
          );
          
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
