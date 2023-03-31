import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    // Set up the nodemailer transporter using the SendGrid API key
    this.transporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_API_KEY,
        },
      }),
    );
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
    const emailBody = `Click on this link to verify your email: ${verificationLink}`;

    const mailOptions = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Verify your email',
      text: emailBody,
    };

    // Use nodemailer to send the email
    await this.transporter.sendMail(mailOptions);
  }
}
