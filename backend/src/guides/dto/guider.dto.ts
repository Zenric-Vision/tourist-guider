import { IsString, IsEmail, IsNotEmpty, IsOptional, IsMobilePhone, MinLength, MaxLength, IsEnum, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GuiderSignupDto {
  @ApiProperty({ example: 'Rahul Sharma or TripOdeal', description: 'Showcase name for the guider' })
  @IsString()
  @IsNotEmpty()
  showcaseName: string;

  @ApiProperty({ example: 'rahul@example.com', description: 'Email address of the guider' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsMobilePhone('en-IN')
  @IsOptional()
  mobile?: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 8 characters)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Professional', enum: ['Professional', 'Agency'], description: 'Type of guider' })
  @IsEnum(['Professional', 'Agency'])
  guiderType: 'Professional' | 'Agency';

  @ApiProperty({ example: 'Mumbai', description: 'City of the guider', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'I love guiding Rajasthan forts!', description: 'Overview (max 200 characters)' })
  @IsString()
  @MaxLength(200)
  overview: string;
}

export class GuiderLoginDto {
  @ApiProperty({ example: 'rahul@example.com', description: 'Email address for login' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class UpdateGuiderDetailsDto {
  // Common fields
  @ApiProperty({ example: 'TripOdeal Pvt Ltd', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: '2020-01-01', required: false })
  @IsOptional()
  @IsDateString()
  foundingDate?: string;

  @ApiProperty({ example: 'https://www.tripodeal.com', required: false })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiProperty({ example: 'https://instagram.com/tripodeal', required: false })
  @IsOptional()
  @IsString()
  socialMediaProfile?: string;

  @ApiProperty({ example: 'https://example.com/gov-doc.pdf', required: false })
  @IsOptional()
  @IsString()
  govDocumentUrl?: string;

  @ApiProperty({ example: 'https://example.com/address-proof.pdf', required: false })
  @IsOptional()
  @IsString()
  officeAddressProofUrl?: string;

  // Professional-specific fields
  @ApiProperty({ example: 'Rahul Sharma', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: ['Hindi', 'English'], required: false })
  @IsOptional()
  @IsArray()
  languagesKnown?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  hasVehicle?: boolean;

  @ApiProperty({ example: 'Toyota Innova, up to 5 seats', required: false })
  @IsOptional()
  @IsString()
  vehicleDescription?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isExperienced?: boolean;

  @ApiProperty({ example: 'https://example.com/prof-gov-doc.pdf', required: false })
  @IsOptional()
  @IsString()
  profGovDocumentUrl?: string;
}

export class UpdateGuiderProgressDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  basicDetailsCompleted?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  videoUploaded?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  eSignCompleted?: boolean;

  @ApiProperty({ example: 'approved', enum: ['pending', 'approved', 'rejected'], required: false })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}
