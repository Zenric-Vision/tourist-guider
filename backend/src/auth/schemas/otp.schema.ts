import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  mobile?: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, enum: ['traveler', 'guider'] })
  userType: 'traveler' | 'guider';

  @Prop({ default: false })
  isUsed: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Indexes for better query performance
OtpSchema.index({ email: 1, userType: 1 });
OtpSchema.index({ mobile: 1, userType: 1 });
OtpSchema.index({ expiresAt: 1 });
OtpSchema.index({ createdAt: 1 });
