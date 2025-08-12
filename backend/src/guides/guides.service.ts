import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class GuidesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async searchGuides(filters: any) {
    const {
      location,
      date,
      minPrice,
      maxPrice,
      languages,
      page = 1,
      limit = 12,
    } = filters;

    const query: any = { role: 'guide', isActive: true };

    // Location filter
    if (location) {
      query.locations = { $regex: location, $options: 'i' };
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = minPrice;
      if (maxPrice) query.pricePerHour.$lte = maxPrice;
    }

    // Language filter
    if (languages && languages.length > 0) {
      query.languages = { $in: languages };
    }

    // Date availability filter
    if (date) {
      query['availability.date'] = date;
    }

    const skip = (page - 1) * limit;

    const [guides, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query),
    ]);

    return {
      guides,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getGuideById(id: string) {
    const guide = await this.userModel
      .findOne({ _id: id, role: 'guide', isActive: true })
      .select('-password');

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return guide;
  }

  async updateAvailability(guideId: string, availability: any[]) {
    const guide = await this.userModel
      .findByIdAndUpdate(
        guideId,
        { availability },
        { new: true }
      )
      .select('-password');

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return guide;
  }
} 