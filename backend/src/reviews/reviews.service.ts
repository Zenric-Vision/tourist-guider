import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createReview(reviewData: any, touristId: string) {
    const { bookingId, guideId, rating, comment } = reviewData;

    const review = new this.reviewModel({
      bookingId,
      touristId,
      guideId,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Update guide's average rating
    await this.updateGuideRating(guideId);

    return savedReview;
  }

  async getReviewsByGuide(guideId: string) {
    return this.reviewModel
      .find({ guideId })
      .populate('touristId', '-password')
      .sort({ createdAt: -1 });
  }

  async getReviewsByTourist(touristId: string) {
    return this.reviewModel
      .find({ touristId })
      .populate('guideId', '-password')
      .sort({ createdAt: -1 });
  }

  private async updateGuideRating(guideId: string) {
    const reviews = await this.reviewModel.find({ guideId });
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await this.userModel.findByIdAndUpdate(guideId, { rating: avgRating });
  }
} 