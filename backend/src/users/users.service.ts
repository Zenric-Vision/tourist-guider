import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateTravelerProfileDto } from './dto/traveler.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-passwordHash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'city', 'profilePictureUrl'];
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    }

    await user.save();
    const updatedUser = await this.userModel.findById(userId).select('-passwordHash');
    return updatedUser;
  }

  async uploadProfilePicture(userId: string, profilePictureUrl: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profilePictureUrl = profilePictureUrl;
    await user.save();
    const updatedUser = await this.userModel.findById(userId).select('-passwordHash');
    return updatedUser;
  }

  async updateTravelPreferences(userId: string, preferences: UpdateTravelerProfileDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update travel preferences
    if (preferences.travelStyle) {
      user.travelStyle = preferences.travelStyle;
    }
    if (preferences.preferredCategories) {
      user.preferredCategories = preferences.preferredCategories;
    }
    if (preferences.travelPreferences) {
      user.travelPreferences = preferences.travelPreferences;
    }
    if (preferences.city) {
      user.city = preferences.city;
    }

    // Award "Profile Explorer" badge if profile is complete
    if (user.travelStyle && user.preferredCategories && user.preferredCategories.length > 0) {
      if (!user.badges.includes('Profile Explorer')) {
        user.badges.push('Profile Explorer');
      }
    }

    await user.save();
    const updatedUser = await this.userModel.findById(userId).select('-passwordHash');
    return updatedUser;
  }

  async getTouristProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Admin methods
  async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    return this.userModel.find().select('-passwordHash').skip(offset).limit(limit);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    await user.save();
    const updatedUser = await this.userModel.findById(userId).select('-passwordHash');
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async getUsersByRole(role: string, limit: number = 20, offset: number = 0): Promise<User[]> {
    // For travelers, we don't have roles, so return all users
    return this.userModel.find().select('-passwordHash').skip(offset).limit(limit);
  }

  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    const searchQuery = {
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
      ],
    };

    return this.userModel.find(searchQuery).select('-passwordHash').limit(limit);
  }
} 