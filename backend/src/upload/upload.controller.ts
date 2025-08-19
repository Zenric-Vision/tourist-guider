import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-picture')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    const imageUrl = await this.uploadService.uploadProfilePicture(file, userId);
    return { imageUrl };
  }

  @Post('guide-images')
  @ApiOperation({ summary: 'Upload guide images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files'))
  async uploadGuideImages(
    @UploadedFile() files: Express.Multer.File[],
    @Body('guideId') guideId: string,
  ) {
    const imageUrls = await this.uploadService.uploadGuideImages(files, guideId);
    return { imageUrls };
  }
}
