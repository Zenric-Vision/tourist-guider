import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private emailService: EmailService,
  ) {}

  async generateOtp(email: string, userType: 'traveler' | 'guider', userName?: string, actionType: 'registration' | 'login' = 'registration'): Promise<string> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // In production, generate random OTP; in development, use constant OTP
    const otp = isProduction 
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456'; // Constant OTP for development
    
    // Store OTP with expiration (15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Delete any existing OTP for this user
    await this.otpModel.deleteMany({ email, userType });
    
    // Create new OTP record
    const otpRecord = new this.otpModel({
      email,
      otp,
      expiresAt,
      userType,
    });
    
    await otpRecord.save();
    
    // Send OTP via email
    try {
      const displayName = userName || email.split('@')[0];
      
      if (isProduction) {
        await this.emailService.sendOtpVerification(email, displayName, otp, actionType);
        console.log(`OTP sent to ${email} (${userType}) via email`);
      } else {
        console.log(`Development OTP sent to ${email} (${userType}): ${otp}`);
      }
    } catch (error) {
      console.error(`Failed to send OTP email to ${email}:`, error);
    }
    
    return otp;
  }

  async verifyOtp(email: string, otp: string, userType: 'traveler' | 'guider'): Promise<boolean> {
    const query = { email, otp, userType, expiresAt: { $gt: new Date() } };

    const otpRecord = await this.otpModel.findOne(query);

    if (otpRecord) {
      // Delete the used OTP
      await this.otpModel.deleteOne({ _id: otpRecord._id });
      return true;
    }

    return false;
  }

  async resendOtp(email: string, userType: 'traveler' | 'guider', userName?: string, actionType: 'registration' | 'login' = 'registration'): Promise<string> {
    return this.generateOtp(email, userType, userName, actionType);
  }

  async checkAndResendIfExpired(email: string, userType: 'traveler' | 'guider', userName?: string, actionType: 'registration' | 'login' = 'login'): Promise<{ hasValidOtp: boolean; newOtp?: string }> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Check if there's a valid (non-expired) OTP
    const validOtp = await this.otpModel.findOne({
      email,
      userType,
      expiresAt: { $gt: new Date() }
    });

    if (validOtp) {
      return { hasValidOtp: true };
    }

    // If no valid OTP exists, generate a new one
    const newOtp = await this.generateOtp(email, userType, userName, actionType);
    
    // Only return OTP in development
    return { 
      hasValidOtp: false, 
      newOtp: isProduction ? undefined : newOtp 
    };
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}
