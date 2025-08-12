import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async createReview(@Request() req, @Body() reviewData: any) {
    return this.reviewsService.createReview(reviewData, req.user._id);
  }

  @Get('guide/:guideId')
  @ApiOperation({ summary: 'Get reviews by guide' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getReviewsByGuide(@Param('guideId') guideId: string) {
    return this.reviewsService.getReviewsByGuide(guideId);
  }

  @Get('tourist/:touristId')
  @ApiOperation({ summary: 'Get reviews by tourist' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getReviewsByTourist(@Param('touristId') touristId: string) {
    return this.reviewsService.getReviewsByTourist(touristId);
  }
} 