import { IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'traveler', enum: ['traveler', 'guider'] })
  @IsEnum(['traveler', 'guider'])
  userType: 'traveler' | 'guider';
}

export class VerifyOtpRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;

  @ApiProperty({ example: 'traveler', enum: ['traveler', 'guider'] })
  @IsEnum(['traveler', 'guider'])
  userType: 'traveler' | 'guider';
}

export class ResendOtpRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'traveler', enum: ['traveler', 'guider'] })
  @IsEnum(['traveler', 'guider'])
  userType: 'traveler' | 'guider';
}
