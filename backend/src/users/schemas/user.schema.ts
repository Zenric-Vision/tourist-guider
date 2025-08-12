import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['tourist', 'guide', 'admin'], default: 'tourist' })
  role: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  bio?: string;

  @Prop([String])
  languages?: string[];

  @Prop()
  experienceYears?: number;

  @Prop([String])
  locations?: string[];

  @Prop()
  pricePerHour?: number;

  @Prop()
  pricePerDay?: number;

  @Prop({ default: 0 })
  rating?: number;

  @Prop([{ date: String, slots: [String] }])
  availability?: Array<{ date: string; slots: string[] }>;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ locations: 1 });
UserSchema.index({ languages: 1 });
UserSchema.index({ rating: -1 });
UserSchema.index({ pricePerHour: 1 });
UserSchema.index({ 'availability.date': 1 }); 