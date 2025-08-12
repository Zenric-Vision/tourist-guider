import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBooking(bookingData: any, touristId: string) {
    const { guideId, place, startDate, durationHours, numPeople, specialRequests } = bookingData;

    // Get guide to calculate price
    const guide = await this.userModel.findById(guideId);
    if (!guide || guide.role !== 'guide') {
      throw new NotFoundException('Guide not found');
    }

    // Calculate price
    const price = guide.pricePerHour * durationHours;

    const booking = new this.bookingModel({
      touristId,
      guideId,
      place,
      startDate: new Date(startDate),
      durationHours,
      numPeople,
      specialRequests,
      price,
    });

    return booking.save();
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.bookingModel
      .findById(id)
      .populate('touristId', '-password')
      .populate('guideId', '-password');

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has access to this booking
    if (booking.touristId.toString() !== userId && booking.guideId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async getMyBookings(userId: string, role?: string) {
    const query: any = {};
    
    if (role === 'tourist') {
      query.touristId = userId;
    } else if (role === 'guide') {
      query.guideId = userId;
    } else {
      // If no role specified, return bookings where user is either tourist or guide
      query.$or = [{ touristId: userId }, { guideId: userId }];
    }

    return this.bookingModel
      .find(query)
      .populate('touristId', '-password')
      .populate('guideId', '-password')
      .sort({ createdAt: -1 });
  }

  async updateBookingStatus(id: string, status: string, userId: string) {
    const booking = await this.bookingModel.findById(id);
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only guide can update booking status
    if (booking.guideId.toString() !== userId) {
      throw new ForbiddenException('Only guide can update booking status');
    }

    booking.status = status;
    return booking.save();
  }
} 