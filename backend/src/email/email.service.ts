import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false), // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private async loadTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }

    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const html = await this.loadTemplate('welcome', { userName });
    
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to: userEmail,
      subject: 'Welcome to TourMate!',
      html,
    });
  }

  async sendBookingConfirmation(
    userEmail: string,
    userName: string,
    bookingDetails: any,
  ): Promise<void> {
    const html = await this.loadTemplate('booking-confirmation', {
      userName,
      bookingDetails,
    });

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to: userEmail,
      subject: 'Booking Confirmation - TourMate',
      html,
    });
  }

  async sendBookingRequest(
    guideEmail: string,
    guideName: string,
    bookingDetails: any,
  ): Promise<void> {
    const html = await this.loadTemplate('booking-request', {
      guideName,
      bookingDetails,
    });

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to: guideEmail,
      subject: 'New Booking Request - TourMate',
      html,
    });
  }

  async sendPasswordReset(userEmail: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const html = await this.loadTemplate('password-reset', {
      resetUrl,
    });

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to: userEmail,
      subject: 'Password Reset Request - TourMate',
      html,
    });
  }

  async sendPaymentConfirmation(
    userEmail: string,
    userName: string,
    paymentDetails: any,
  ): Promise<void> {
    const html = await this.loadTemplate('payment-confirmation', {
      userName,
      paymentDetails,
    });

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to: userEmail,
      subject: 'Payment Confirmation - TourMate',
      html,
    });
  }

  async sendCustomEmail(
    to: string,
    subject: string,
    templateName: string,
    data: any,
  ): Promise<void> {
    const html = await this.loadTemplate(templateName, data);

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to,
      subject,
      html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  }
}
