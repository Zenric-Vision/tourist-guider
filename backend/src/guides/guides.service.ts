import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guider, GuiderDocument } from './schemas/guider.schema';
import { UpdateGuiderDetailsDto, UpdateGuiderProgressDto } from './dto/guider.dto';

@Injectable()
export class GuidesService {
  constructor(
    @InjectModel(Guider.name) private guiderModel: Model<GuiderDocument>,
  ) {}

  async findAll(filters: any = {}): Promise<Guider[]> {
    const query: any = { isActive: true };
    
    if (filters.location) {
      query.$or = [
        { city: { $regex: filters.location, $options: 'i' } },
      ];
    }

    if (filters.guiderType) {
      query.guiderType = filters.guiderType;
    }

    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified;
    }

    return this.guiderModel.find(query).select('-passwordHash');
  }

  async findById(id: string): Promise<Guider> {
    const guider = await this.guiderModel.findById(id).select('-passwordHash');
    if (!guider) {
      throw new NotFoundException('Guider not found');
    }
    return guider;
  }

  async updateVerificationProgress(guiderId: string, progressData: UpdateGuiderProgressDto): Promise<Guider> {
    const guider = await this.guiderModel.findById(guiderId);
    if (!guider) {
      throw new NotFoundException('Guider not found');
    }

    // Update progress fields
    if (progressData.basicDetailsCompleted !== undefined) {
      guider.basicDetailsCompleted = progressData.basicDetailsCompleted;
    }
    if (progressData.videoUploaded !== undefined) {
      guider.videoUploaded = progressData.videoUploaded;
    }
    if (progressData.eSignCompleted !== undefined) {
      guider.eSignCompleted = progressData.eSignCompleted;
    }
    if (progressData.approvalStatus) {
      guider.approvalStatus = progressData.approvalStatus;
    }

    // Calculate verification progress
    let progress = 0;
    if (guider.basicDetailsCompleted) progress += 25;
    if (guider.videoUploaded) progress += 25;
    if (guider.eSignCompleted) progress += 25;
    if (guider.approvalStatus === 'approved') progress += 25;

    // Update badges based on progress
    if (!guider.badges) guider.badges = [];
    
    if (progress === 100 && guider.approvalStatus === 'approved') {
      if (guider.guiderType === 'Agency') {
        if (!guider.badges.includes('Verified Agency')) {
          guider.badges.push('Verified Agency');
        }
      } else {
        if (!guider.badges.includes('Verified Professional')) {
          guider.badges.push('Verified Professional');
        }
      }
      guider.tourPoints = 100;
    }

    await guider.save();
    const updatedGuider = await this.guiderModel.findById(guiderId).select('-passwordHash');
    return updatedGuider;
  }

  async updateProfile(guiderId: string, profileData: UpdateGuiderDetailsDto): Promise<Guider> {
    const guider = await this.guiderModel.findById(guiderId);
    if (!guider) {
      throw new NotFoundException('Guider not found');
    }

    // Update common fields
    const commonFields = ['companyName', 'foundingDate', 'websiteUrl', 'socialMediaProfile', 'govDocumentUrl', 'officeAddressProofUrl'];
    for (const field of commonFields) {
      if (profileData[field] !== undefined) {
        guider[field] = profileData[field];
      }
    }

    // Update professional-specific fields
    if (guider.guiderType === 'Professional') {
      const profFields = ['fullName', 'languagesKnown', 'hasVehicle', 'vehicleDescription', 'isExperienced', 'profGovDocumentUrl'];
      for (const field of profFields) {
        if (profileData[field] !== undefined) {
          guider[field] = profileData[field];
        }
      }
    }

    await guider.save();
    const updatedGuider = await this.guiderModel.findById(guiderId).select('-passwordHash');
    return updatedGuider;
  }

  async updateAvailability(guiderId: string, availability: any[]): Promise<Guider> {
    const guider = await this.guiderModel.findById(guiderId);
    if (!guider) {
      throw new NotFoundException('Guider not found');
    }

    // TODO: Implement availability update logic
    // This would depend on how you want to store availability

    await guider.save();
    const updatedGuider = await this.guiderModel.findById(guiderId).select('-passwordHash');
    return updatedGuider;
  }

  async getFeaturedGuides(limit: number = 10): Promise<Guider[]> {
    return this.guiderModel.find({ 
      isVerified: true, 
      isActive: true 
    })
    .select('-passwordHash')
    .sort({ tourPoints: -1, createdAt: -1 })
    .limit(limit);
  }

  async getPopularDestinations(): Promise<string[]> {
    const destinations = await this.guiderModel.aggregate([
      { $match: { isActive: true, isVerified: true } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { city: '$_id' } }
    ]);

    return destinations.map(d => d.city);
  }

  async getTourTypes(): Promise<string[]> {
    // For guiders, we can return common tour categories
    return [
      'Historical Monuments',
      'Beach Destinations',
      'Hill Stations',
      'Spiritual Sites',
      'Wildlife Sanctuaries',
      'Adventure Sports',
      'Cultural Festivals',
      'Museums & Galleries',
      'National Parks',
      'Urban Exploration'
    ];
  }

  async getSpecializations(): Promise<string[]> {
    // Return common specializations for guiders
    return [
      'Historical Tours',
      'Adventure Tours',
      'Cultural Tours',
      'Wildlife Tours',
      'Spiritual Tours',
      'Food Tours',
      'Photography Tours',
      'Educational Tours',
      'Luxury Tours',
      'Budget Tours'
    ];
  }

  async getSimilarGuides(guiderId: string, limit: number = 5): Promise<Guider[]> {
    const guider = await this.guiderModel.findById(guiderId);
    if (!guider) {
      throw new NotFoundException('Guider not found');
    }

    return this.guiderModel.find({
      _id: { $ne: guiderId },
      city: guider.city,
      guiderType: guider.guiderType,
      isActive: true,
      isVerified: true
    })
    .select('-passwordHash')
    .limit(limit);
  }
} 