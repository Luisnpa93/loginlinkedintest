import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request-reset')
  async requestPasswordReset(@Body('email') email: string): Promise<void> {
    await this.passwordResetService.generatePasswordResetToken(email);
  }

  @Put('reset')
  async resetPassword(@Body() body: any): Promise<void> {
    const token = body.token;
    const password = body.password;
    await this.passwordResetService.resetPassword(token, password);
  }
  
}
