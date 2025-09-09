import { IsString, IsEmail, IsNotEmpty, IsOptional, IsMobilePhone, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TravelerSignupDto {
  @ApiProperty({ example: 'John', description: 'First name of the traveler' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the traveler' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the traveler' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  mobile?: string;

  @ApiProperty({ example: 'Mumbai', description: 'City of the traveler', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 8 characters)' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class TravelerLoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address for login' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class UpdateTravelerProfileDto {
  @ApiProperty({ example: 'Adventure', required: false })
  @IsOptional()
  @IsString()
  travelStyle?: string;

  @ApiProperty({ example: ['Historical Monuments', 'Beach Destinations'], required: false })
  @IsOptional()
  preferredCategories?: string[];

  @ApiProperty({ example: 'Love adventure and cultural tours', required: false })
  @IsOptional()
  @IsString()
  travelPreferences?: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsOptional()
  @IsString()
  city?: string;
}
