import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  touristId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  guideId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Indexes for better query performance
ReviewSchema.index({ guideId: 1 });
ReviewSchema.index({ touristId: 1 });
ReviewSchema.index({ bookingId: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ guideId: 1, rating: -1 }); 