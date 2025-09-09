import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GuidesService } from './guides.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Guides')
@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  @ApiOperation({ summary: 'Search guides with filters' })
  @ApiResponse({ status: 200, description: 'Guides retrieved successfully' })
  async searchGuides(@Query() filters: any) {
    return this.guidesService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured guides' })
  @ApiResponse({ status: 200, description: 'Featured guides retrieved successfully' })
  async getFeaturedGuides(@Query('limit') limit?: number) {
    return this.guidesService.getFeaturedGuides(limit);
  }

  @Get('destinations/popular')
  @ApiOperation({ summary: 'Get popular destinations' })
  @ApiResponse({ status: 200, description: 'Popular destinations retrieved successfully' })
  async getPopularDestinations() {
    return this.guidesService.getPopularDestinations();
  }

  @Get('tour-types')
  @ApiOperation({ summary: 'Get available tour types' })
  @ApiResponse({ status: 200, description: 'Tour types retrieved successfully' })
  async getTourTypes() {
    return this.guidesService.getTourTypes();
  }

  @Get('specializations')
  @ApiOperation({ summary: 'Get available specializations' })
  @ApiResponse({ status: 200, description: 'Specializations retrieved successfully' })
  async getSpecializations() {
    return this.guidesService.getSpecializations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guide by ID' })
  @ApiResponse({ status: 200, description: 'Guide retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Guide not found' })
  async getGuideById(@Param('id') id: string) {
    return this.guidesService.findById(id);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar guides' })
  @ApiResponse({ status: 200, description: 'Similar guides retrieved successfully' })
  async getSimilarGuides(
    @Param('id') id: string,
    @Query('limit') limit?: number
  ) {
    return this.guidesService.getSimilarGuides(id, limit);
  }

  @Patch(':id/verification-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guide verification progress' })
  @ApiResponse({ status: 200, description: 'Verification progress updated successfully' })
  @ApiResponse({ status: 404, description: 'Guide not found' })
  async updateVerificationProgress(
    @Param('id') id: string,
    @Body() progressData: any,
    @Request() req
  ) {
    // Ensure user can only update their own verification progress
    if (req.user.sub !== id) {
      throw new Error('Unauthorized to update this guide');
    }
    return this.guidesService.updateVerificationProgress(id, progressData);
  }

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guide profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Guide not found' })
  async updateProfile(
    @Param('id') id: string,
    @Body() profileData: any,
    @Request() req
  ) {
    // Ensure user can only update their own profile
    if (req.user.sub !== id) {
      throw new Error('Unauthorized to update this guide');
    }
    return this.guidesService.updateProfile(id, profileData);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guide availability' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  @ApiResponse({ status: 404, description: 'Guide not found' })
  async updateAvailability(
    @Param('id') id: string,
    @Body() availability: any[],
    @Request() req
  ) {
    // Ensure user can only update their own availability
    if (req.user.sub !== id) {
      throw new Error('Unauthorized to update this guide');
    }
    return this.guidesService.updateAvailability(id, availability);
  }
} 