import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, maxlength: 50 })
  lastName: string;

  @Prop({ unique: true, sparse: true, required: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  mobile?: string;

  @Prop({ required: false })
  city?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: false })
  isVerified: boolean; // after OTP

  // Profile fields
  @Prop()
  profilePictureUrl?: string;

  @Prop({ enum: ['Adventure', 'Cultural', 'Relaxation', 'Wildlife'] })
  travelStyle?: string;

  @Prop([String])
  preferredCategories?: string[];

  @Prop({ type: String })
  travelPreferences?: string;

  @Prop([String])
  badges?: string[];

  @Prop({ default: 0 })
  tourPoints?: number;

  @Prop({ default: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ city: 1 });
UserSchema.index({ isVerified: 1 });
UserSchema.index({ isActive: 1 }); 