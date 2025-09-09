import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { OtpService } from './otp.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Guider, GuiderDocument } from '../guides/schemas/guider.schema';
import { TravelerSignupDto, TravelerLoginDto } from '../users/dto/traveler.dto';
import { GuiderSignupDto, GuiderLoginDto } from '../guides/dto/guider.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { AuthResponse, OtpResponse, ApiResponse } from '../common/interfaces/api-response.interface';

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Guider.name) private guiderModel: Model<GuiderDocument>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  // OTP Methods - Only resendOtp is used by the new flow
  async resendOtp(email: string, userType: 'traveler' | 'guider', userName?: string, actionType: 'registration' | 'login' = 'registration'): Promise<OtpResponse> {
    await this.otpService.resendOtp(email, userType, userName, actionType);
    
    return ResponseUtil.otpSuccess(
      `OTP resent successfully to ${email}`,
      true,
      15
    );
  }

  // Traveler Authentication - New streamlined approach
  async registerTraveler(signupDto: TravelerSignupDto): Promise<AuthResponse<any>> {
    const { firstName, lastName, email, mobile, city, password } = signupDto;

    // Check if user already exists
    const existingTraveler = await this.userModel.findOne({ email });

    if (existingTraveler) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const travelerData: any = {
      firstName,
      lastName,
      email,
      city,
      passwordHash: hashedPassword,
      isVerified: false, // User starts as unverified
      tourPoints: 0,
      badges: ['New Traveller Mate'],
    };

    if (mobile) travelerData.mobile = mobile;

    const traveler = new this.userModel(travelerData);
    const savedTraveler = await traveler.save();

    // Send OTP as part of registration process
    const userName = `${firstName} ${lastName}`;
    await this.otpService.generateOtp(email, 'traveler', userName, 'registration');

    const userData = {
      id: savedTraveler._id,
      firstName: savedTraveler.firstName,
      lastName: savedTraveler.lastName,
      email: savedTraveler.email,
      mobile: savedTraveler.mobile,
      city: savedTraveler.city,
      isVerified: savedTraveler.isVerified,
      tourPoints: savedTraveler.tourPoints,
      badges: savedTraveler.badges,
    };

    return ResponseUtil.authRequiresVerification(
      userData,
      'Registration successful! OTP sent to your email. Please verify to complete registration.',
      true
    );
  }

  async loginTraveler(loginDto: TravelerLoginDto): Promise<AuthResponse<any>> {
    const { email, password } = loginDto;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const traveler = await this.userModel.findOne({ email });

    if (!traveler) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!traveler.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, traveler.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userData = {
      id: traveler._id,
      firstName: traveler.firstName,
      lastName: traveler.lastName,
      email: traveler.email,
      mobile: traveler.mobile,
      city: traveler.city,
      isVerified: traveler.isVerified,
      tourPoints: traveler.tourPoints,
      badges: traveler.badges,
    };

    // If user is not verified, check OTP status and send new one if expired
    if (!traveler.isVerified) {
      // Check if there's a valid OTP or send a new one if expired
      const userName = `${traveler.firstName} ${traveler.lastName}`;
      const otpStatus = await this.otpService.checkAndResendIfExpired(email, 'traveler', userName, 'login');
      
      let message = 'Account not verified. Please verify your OTP to complete registration.';
      if (!otpStatus.hasValidOtp) {
        message = 'Account not verified. A new OTP has been sent to your email. Please verify to complete registration.';
      }

      return ResponseUtil.authRequiresVerification(
        userData,
        message,
        !otpStatus.hasValidOtp
      );
    }

    // Generate JWT token for verified users
    const payload = { 
      sub: traveler._id, 
      email: traveler.email, 
      mobile: traveler.mobile,
      userType: 'traveler',
      isVerified: traveler.isVerified 
    };
    
    const token = this.jwtService.sign(payload);

    return ResponseUtil.authSuccess(
      userData,
      token,
      'Login successful'
    );
  }

  // Guider Authentication - Updated to match traveler flow
  async registerGuider(signupDto: GuiderSignupDto): Promise<AuthResponse<any>> {
    const { showcaseName, email, mobile, city, password, guiderType, overview } = signupDto;

    // Check if user already exists
    const existingGuider = await this.guiderModel.findOne({ email });

    if (existingGuider) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const guiderData: any = {
      showcaseName,
      email,
      city,
      passwordHash: hashedPassword,
      guiderType,
      overview,
      isVerified: false, // Guider starts as unverified
      tourPoints: 50,
      badges: ['Guider Mate'],
    };

    if (mobile) guiderData.mobile = mobile;

    // Pre-fill fullName for professionals
    if (guiderType === 'Professional') {
      guiderData.fullName = showcaseName;
    }

    const guider = new this.guiderModel(guiderData);
    const savedGuider = await guider.save();

    // Send OTP as part of registration process
    const userName = showcaseName;
    await this.otpService.generateOtp(email, 'guider', userName, 'registration');

    const userData = {
      id: savedGuider._id,
      showcaseName: savedGuider.showcaseName,
      email: savedGuider.email,
      mobile: savedGuider.mobile,
      city: savedGuider.city,
      guiderType: savedGuider.guiderType,
      overview: savedGuider.overview,
      isVerified: savedGuider.isVerified,
      tourPoints: savedGuider.tourPoints,
      badges: savedGuider.badges,
    };

    return ResponseUtil.authRequiresVerification(
      userData,
      'Registration successful! OTP sent to your email. Please verify to complete registration.',
      true
    );
  }

  async loginGuider(loginDto: GuiderLoginDto): Promise<AuthResponse<any>> {
    const { email, password } = loginDto;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const guider = await this.guiderModel.findOne({ email });

    if (!guider) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!guider.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, guider.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userData = {
      id: guider._id,
      showcaseName: guider.showcaseName,
      email: guider.email,
      mobile: guider.mobile,
      city: guider.city,
      guiderType: guider.guiderType,
      overview: guider.overview,
      isVerified: guider.isVerified,
      tourPoints: guider.tourPoints,
      badges: guider.badges,
    };

    // If guider is not verified, check OTP status and send new one if expired
    if (!guider.isVerified) {
      // Check if there's a valid OTP or send a new one if expired
      const userName = guider.showcaseName;
      const otpStatus = await this.otpService.checkAndResendIfExpired(email, 'guider', userName, 'login');
      
      let message = 'Account not verified. Please verify your OTP to complete registration.';
      if (!otpStatus.hasValidOtp) {
        message = 'Account not verified. A new OTP has been sent to your email. Please verify to complete registration.';
      }

      return ResponseUtil.authRequiresVerification(
        userData,
        message,
        !otpStatus.hasValidOtp
      );
    }

    // Generate JWT token for verified guiders
    const payload = { 
      sub: guider._id, 
      email: guider.email, 
      mobile: guider.mobile,
      userType: 'guider',
      guiderType: guider.guiderType,
      isVerified: guider.isVerified 
    };
    
    const token = this.jwtService.sign(payload);

    return ResponseUtil.authSuccess(
      userData,
      token,
      'Login successful'
    );
  }

  // Verify OTP and complete registration - New streamlined method
  async verifyOtpAndCompleteRegistration(email: string, otp: string, userType: 'traveler' | 'guider'): Promise<AuthResponse<any>> {
    // First verify the OTP
    const isValidOtp = await this.otpService.verifyOtp(email, otp, userType);
    
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Then activate the account
    if (userType === 'traveler') {
      const traveler = await this.userModel.findOne({ email });

      if (!traveler) {
        throw new BadRequestException('Traveler not found');
      }

      traveler.isVerified = true;
      await traveler.save();

      // Generate JWT token for verified user
      const payload = { 
        sub: traveler._id, 
        email: traveler.email, 
        mobile: traveler.mobile,
        userType: 'traveler',
        isVerified: traveler.isVerified 
      };
      
      const token = this.jwtService.sign(payload);

      const userData = {
        id: traveler._id,
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        email: traveler.email,
        mobile: traveler.mobile,
        city: traveler.city,
        isVerified: traveler.isVerified,
        tourPoints: traveler.tourPoints,
        badges: traveler.badges,
      };

      return ResponseUtil.authSuccess(
        userData,
        token,
        'Account verified successfully! Registration completed.'
      );
    } else {
      const guider = await this.guiderModel.findOne({ email });

      if (!guider) {
        throw new BadRequestException('Guider not found');
      }

      guider.isVerified = true;
      await guider.save();

      // Generate JWT token for verified guider
      const payload = { 
        sub: guider._id, 
        email: guider.email, 
        mobile: guider.mobile,
        userType: 'guider',
        guiderType: guider.guiderType,
        isVerified: guider.isVerified 
      };
      
      const token = this.jwtService.sign(payload);

      const userData = {
        id: guider._id,
        showcaseName: guider.showcaseName,
        email: guider.email,
        mobile: guider.mobile,
        city: guider.city,
        guiderType: guider.guiderType,
        overview: guider.overview,
        isVerified: guider.isVerified,
        tourPoints: guider.tourPoints,
        badges: guider.badges,
      };

      return ResponseUtil.authSuccess(
        userData,
        token,
        'Account verified successfully! Registration completed.'
      );
    }
  }


  // Change password
  async changePassword(userId: string, userType: 'traveler' | 'guider', oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    // Validate required fields
    if (!oldPassword || !newPassword) {
      const errors = [];
      if (!oldPassword) {
        errors.push({ field: 'oldPassword', message: 'Old password is required' });
      }
      if (!newPassword) {
        errors.push({ field: 'newPassword', message: 'New password is required' });
      }
      throw new BadRequestException('Validation failed');
    }

    // Validate password strength (basic validation)
    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters long');
    }

    let user;
    
    if (userType === 'traveler') {
      user = await this.userModel.findById(userId);
    } else {
      user = await this.guiderModel.findById(userId);
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.passwordHash = hashedNewPassword;
    await user.save();

    return ResponseUtil.success(null, 'Password changed successfully');
  }
} 