import { Injectable } from '@nestjs/common';
import { EmailVerificationService } from '../email_verification_service/email.service';

@Injectable()
export class SupportService {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async submitSupportForm(supportData: any): Promise<boolean> {
    try {
        await this.emailVerificationService.sendSupportEmail(
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
