import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  touristId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  guideId: Types.ObjectId;

  @Prop({ required: true })
  place: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true, min: 1 })
  durationHours: number;

  @Prop({ required: true, min: 1 })
  numPeople: number;

  @Prop()
  specialRequests?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    required: true,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop()
  paymentIntentId?: string;

  @Prop({ default: false })
  isPaid: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Indexes for better query performance
BookingSchema.index({ touristId: 1 });
BookingSchema.index({ guideId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ startDate: 1 });
BookingSchema.index({ touristId: 1, status: 1 });
BookingSchema.index({ guideId: 1, status: 1 }); 