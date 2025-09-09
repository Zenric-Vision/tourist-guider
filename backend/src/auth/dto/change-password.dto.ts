import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'currentPassword123',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword456',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
