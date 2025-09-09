import { Controller, Post, Get, Param, Patch, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async createBooking(@Request() req, @Body() bookingData: any) {
    return this.bookingsService.createBooking(bookingData, req.user._id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getMyBookings(
    @Request() req, 
    @Query('userType') userType?: 'traveler' | 'guider'
  ) {
    return this.bookingsService.getMyBookings(req.user._id, userType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  async getBookingById(@Request() req, @Param('id') id: string) {
    return this.bookingsService.getBookingById(id, req.user._id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  async updateBookingStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.bookingsService.updateBookingStatus(id, body.status, req.user._id);
  }
} 