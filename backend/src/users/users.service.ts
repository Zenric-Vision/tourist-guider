import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password');
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async updateProfilePicture(userId: string, profilePicture: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { profilePicture },
        { new: true }
      )
      .select('-password');
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }
} 