import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Guider, GuiderDocument } from '../guides/schemas/guider.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Guider.name) private guiderModel: Model<GuiderDocument>,
  ) {}

  async createBooking(bookingData: any, touristId: string) {
    const { guideId, place, startDate, durationHours, numPeople, specialRequests } = bookingData;

    // Get guide to calculate price
    const guide = await this.guiderModel.findById(guideId);
    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Calculate price based on guide's pricing
    let price = 0;
    if (guide.pricePerHour) {
      price = guide.pricePerHour * durationHours;
    } else if (guide.pricePerDay) {
      price = guide.pricePerDay * Math.ceil(durationHours / 8);
    } else if (guide.pricePerTour) {
      price = guide.pricePerTour;
    } else {
      // Default pricing if no pricing set
      price = 1000 * durationHours; // ₹1000 per hour default
    }

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
      .populate('touristId', '-passwordHash')
      .populate('guideId', '-passwordHash');

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has access to this booking
    if (booking.touristId.toString() !== userId && booking.guideId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async getMyBookings(userId: string, userType?: 'traveler' | 'guider') {
    const query: any = {};
    
    if (userType === 'traveler') {
      query.touristId = userId;
    } else if (userType === 'guider') {
      query.guideId = userId;
    } else {
      // If no userType specified, return bookings where user is either tourist or guide
      query.$or = [{ touristId: userId }, { guideId: userId }];
    }

    return this.bookingModel
      .find(query)
      .populate('touristId', '-passwordHash')
      .populate('guideId', '-passwordHash')
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