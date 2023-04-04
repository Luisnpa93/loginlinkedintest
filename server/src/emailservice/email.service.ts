import { Injectable } from '@nestjs/common';
import { ApiClient, SendSmtpEmail, TransactionalEmailsApi } from 'sib-api-v3-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  private readonly apiKey: string;
  private readonly apiInstance;

  constructor() {
    this.apiKey = process.env.SENDINBLUE_API_KEY;
    const defaultClient = ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = this.apiKey;
    this.apiInstance = new TransactionalEmailsApi();
  }

  async sendVerificationEmail(email: string, verificationLink: string): Promise<void> {
    const SMTP_SERVER = 'smtp-relay.sendinblue.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = process.env.SENDINBLUE_USERNAME;
    const SMTP_PASSWORD = process.env.SENDINBLUE_PASSWORD;
    const smtpMailData: SendSmtpEmail = {
      sender: { email: 'luismiguelmartinsalmeida@gmail.com', name: 'Luis' },
      to: [{ email }],
      subject: 'Verification Email',
      params: { verification_link: verificationLink },
      htmlContent: '<p>Click the link below to verify your email:</p><a href="{{ params.verification_link }}">Verify Email</a>',
    }; 
    const smtpApi = new TransactionalEmailsApi();
    const sendSmtpEmail = {
      sender: smtpMailData.sender,
      to: smtpMailData.to,
      htmlContent: smtpMailData.htmlContent,
      subject: smtpMailData.subject,
      params: smtpMailData.params,
      headers: { 'api-key': this.apiKey },
    };
    const opts = {
      smtpServer: {
        address: SMTP_SERVER,
        port: SMTP_PORT,
        login: SMTP_USERNAME,
        password: SMTP_PASSWORD,
        ssl: false,
      },
    };
    await smtpApi.sendTransacEmail(sendSmtpEmail, opts)
      .then((data) => {
        console.log(`Email sent to ${email}: ${data.messageId}`);
      })
      .catch((error) => {
        console.error(`Error sending email to ${email}: ${error.message}`);
        throw new Error(error);
      });
  }
  
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const SMTP_SERVER = 'smtp-relay.sendinblue.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = process.env.SENDINBLUE_USERNAME;
    const SMTP_PASSWORD = process.env.SENDINBLUE_PASSWORD;
  
    const smtpMailData: SendSmtpEmail = {
      sender: { email: 'example@yourdomain.com', name: 'Your Name' },
      to: [{ email }],
      subject: 'Password Reset Request',
      params: { reset_link: resetLink },
      htmlContent: '<p>You have requested to reset your password. Click the link below to reset your password:</p><a href="{{ params.reset_link }}">Reset Password</a>',
    };
  
    const smtpApi = new TransactionalEmailsApi();
    const sendSmtpEmail = {
      sender: smtpMailData.sender,
      to: smtpMailData.to,
      htmlContent: smtpMailData.htmlContent,
      subject: smtpMailData.subject,
      params: smtpMailData.params,
      headers: { 'api-key': this.apiKey },
    };
  
    const opts = {
      smtpServer: {
        address: SMTP_SERVER,
        port: SMTP_PORT,
        login: SMTP_USERNAME,
        password: SMTP_PASSWORD,
        ssl: false,
      },
    };
  
    await smtpApi.sendTransacEmail(sendSmtpEmail, opts)
      .then((data) => {
        console.log(`Email sent to ${email}: ${data.messageId}`);
      })
      .catch((error) => {
        console.error(`Error sending email to ${email}: ${error.message}`);
        throw new Error(error);
      });
  }

  async sendSupportEmail(name: string, email: string, message: string): Promise<void> {
    const SMTP_SERVER = 'smtp-relay.sendinblue.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = process.env.SENDINBLUE_USERNAME;
    const SMTP_PASSWORD = process.env.SENDINBLUE_PASSWORD;
    
    const smtpMailData: SendSmtpEmail = {
      sender: { email: email, name: name },
      to: [{ email: 'luis93.pa@gmail.com' }],
      subject: 'Support Request',
      htmlContent: `<p>${message}</p>`
    };
  
    const smtpApi = new TransactionalEmailsApi();
    const sendSmtpEmail = {
      sender: smtpMailData.sender,
      to: smtpMailData.to,
      htmlContent: smtpMailData.htmlContent,
      subject: smtpMailData.subject,
      headers: { 'api-key': this.apiKey },
    };
  
    const opts = {
      smtpServer: {
        address: SMTP_SERVER,
        port: SMTP_PORT,
        login: SMTP_USERNAME,
        password: SMTP_PASSWORD,
        ssl: false,
      },
    };
  
    await smtpApi.sendTransacEmail(sendSmtpEmail, opts)
      .then((data) => {
        console.log(`Email sent to support: ${data.messageId}`);
      })
      .catch((error) => {
        console.error(`Error sending email to support: ${error.message}`);
        throw new Error(error);
      });
  }


  


  async sendNewsletterEmail(email: string, name: string, message: string): Promise<void> {
    const SMTP_SERVER = 'smtp-relay.sendinblue.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = process.env.SENDINBLUE_USERNAME;
    const SMTP_PASSWORD = process.env.SENDINBLUE_PASSWORD;
    
    const smtpMailData: SendSmtpEmail = {
      sender: { email: 'example@yourdomain.com', name: 'Your Name' },
      to: [{ email: email }],
      subject: 'Re.start Newsletter',
      htmlContent: `<p>${message}</p>`
    };
  
    const smtpApi = new TransactionalEmailsApi();
    const sendSmtpEmail = {
      sender: smtpMailData.sender,
      to: smtpMailData.to,
      htmlContent: smtpMailData.htmlContent,
      subject: smtpMailData.subject,
      headers: { 'api-key': this.apiKey },
    };
  
    const opts = {
      smtpServer: {
        address: SMTP_SERVER,
        port: SMTP_PORT,
        login: SMTP_USERNAME,
        password: SMTP_PASSWORD,
        ssl: false,
      },
    };
  
    await smtpApi.sendTransacEmail(sendSmtpEmail, opts)
      .then((data) => {
        console.log(`Email sent to support: ${data.messageId}`);
      })
      .catch((error) => {
        console.error(`Error sending email to support: ${error.message}`);
        throw new Error(error);
      });
  }

}
