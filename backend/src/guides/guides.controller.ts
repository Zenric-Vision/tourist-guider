import { Controller, Get, Query, Param, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GuidesService } from './guides.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Guides')
@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  @ApiOperation({ summary: 'Search guides' })
  @ApiResponse({ status: 200, description: 'Guides retrieved successfully' })
  async searchGuides(@Query() query: any) {
    return this.guidesService.searchGuides(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guide by ID' })
  @ApiResponse({ status: 200, description: 'Guide retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Guide not found' })
  async getGuideById(@Param('id') id: string) {
    return this.guidesService.getGuideById(id);
  }

  @Patch('availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guide availability' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  async updateAvailability(@Request() req, @Body() body: { availability: any[] }) {
    return this.guidesService.updateAvailability(req.user._id, body.availability);
  }
} 