import { IsString, IsEmail, IsOptional, IsMobilePhone, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TravelerSignupDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsMobilePhone('en-IN')
  @IsOptional()
  mobile?: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class GuiderSignupDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  @IsNotEmpty()
  showcaseName: string;

  @ApiProperty({ example: 'rahul@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsMobilePhone('en-IN')
  @IsOptional()
  mobile?: string;

  @ApiProperty({ example: 'Professional', enum: ['Professional', 'Agency'] })
  @IsEnum(['Professional', 'Agency'])
  @IsNotEmpty()
  guiderType: 'Professional' | 'Agency';

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Experienced tour guide with 5+ years...' })
  @IsString()
  @IsNotEmpty()
  overview: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
} 