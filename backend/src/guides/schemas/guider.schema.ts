import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuiderDocument = Guider & Document;

@Schema({ timestamps: true })
export class Guider {
  @Prop({ required: true })
  showcaseName: string; // e.g. "Rahul Sharma" or "TripOdeal"

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop({ unique: true, sparse: true })
  mobile?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['Professional', 'Agency'] })
  guiderType: 'Professional' | 'Agency';

  @Prop({ required: true })
  city: string;

  @Prop({ type: String, maxlength: 200 })
  overview: string;

  @Prop({ default: false })
  isVerified: boolean; // OTP verification

  // Common progress fields
  @Prop({ default: false })
  basicDetailsCompleted: boolean;

  @Prop({ default: false })
  videoUploaded: boolean;

  @Prop({ default: false })
  eSignCompleted: boolean;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  approvalStatus: 'pending' | 'approved' | 'rejected';

  // Agency specific
  @Prop()
  companyName?: string;

  @Prop({ type: Date })
  foundingDate?: Date;

  @Prop()
  websiteUrl?: string;

  @Prop()
  socialMediaProfile?: string;

  @Prop()
  govDocumentUrl?: string; // Certificate of Incorporation/Deed

  @Prop()
  officeAddressProofUrl?: string;

  // Professional specific
  @Prop()
  fullName?: string; // Pre-filled from signup

  @Prop([String])
  languagesKnown?: string[]; // ["Hindi","English"]

  @Prop()
  hasVehicle?: boolean;

  @Prop()
  vehicleDescription?: string;

  @Prop()
  isExperienced?: boolean;

  @Prop()
  profGovDocumentUrl?: string;

  // Optional compliance
  @Prop()
  panCardUrl?: string;

  @Prop()
  gstCertificateUrl?: string;

  @Prop()
  bankStatementUrl?: string;

  @Prop()
  motApprovalLetterUrl?: string;

  @Prop()
  incomeTaxReturnsUrl?: string;

  // Progress Bar Data
  @Prop()
  videoUrl?: string;

  @Prop()
  eSignDocUrl?: string;

  @Prop()
  rejectionReason?: string;

  @Prop({ default: 0 })
  tourPoints?: number;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop([String])
  badges?: string[];

  // Tour Guide Specific Fields
  @Prop([String])
  tourTypes?: string[]; // ['Cultural', 'Adventure', 'Food', 'Historical', 'Nature', 'Spiritual', 'Shopping', 'Photography']

  @Prop([String])
  specializations?: string[]; // ['Ancient Temples', 'Street Food', 'Yoga', 'Ayurveda', 'Wildlife', 'Architecture', 'Art', 'Music']

  @Prop([String])
  certifications?: string[]; // ['Government Licensed', 'Tourism Board Certified', 'First Aid', 'Wildlife Guide', 'Cultural Expert']

  @Prop()
  pricePerHour?: number;

  @Prop()
  pricePerDay?: number;

  @Prop()
  pricePerTour?: number;

  @Prop()
  currency?: string;

  @Prop()
  rating?: number;

  @Prop()
  totalReviews?: number;

  @Prop()
  totalTours?: number;

  @Prop()
  responseTime?: number; // in hours

  @Prop()
  cancellationPolicy?: string;

  @Prop([String])
  tourDurations?: string[]; // ['Half Day', 'Full Day', 'Multi Day', 'Custom']

  @Prop([String])
  groupSizes?: string[]; // ['Private', 'Small Group', 'Large Group']

  @Prop([String])
  accessibility?: string[]; // ['Wheelchair Accessible', 'Kid Friendly', 'Senior Friendly', 'Pet Friendly']

  @Prop([{ date: String, slots: [String] }])
  availability?: Array<{ date: string; slots: string[] }>;

  @Prop([String])
  gallery?: string[]; // Tour photos

  @Prop([String])
  highlights?: string[]; // Key attractions/experiences

  @Prop()
  aboutMe?: string; // Detailed guide description

  @Prop()
  whyChooseMe?: string; // Unique selling points

  @Prop([String])
  languagesSpoken?: string[]; // More detailed language info

  @Prop()
  education?: string;

  @Prop([String])
  awards?: string[];

  @Prop()
  isFeatured?: boolean;

  // India-specific fields
  @Prop([String])
  indianStates?: string[]; // States in India where guide operates

  @Prop([String])
  indianCities?: string[]; // Cities in India where guide operates

  @Prop([String])
  indianLanguages?: string[]; // Indian languages spoken

  @Prop([String])
  indianCuisines?: string[]; // Knowledge of Indian cuisines

  @Prop([String])
  indianFestivals?: string[]; // Knowledge of Indian festivals

  @Prop()
  hasGSTNumber?: boolean;

  @Prop()
  gstNumber?: string;
}

export const GuiderSchema = SchemaFactory.createForClass(Guider);

// Indexes for better query performance
GuiderSchema.index({ email: 1 });
GuiderSchema.index({ mobile: 1 });
GuiderSchema.index({ city: 1 });
GuiderSchema.index({ guiderType: 1 });
GuiderSchema.index({ isVerified: 1 });
GuiderSchema.index({ approvalStatus: 1 });
GuiderSchema.index({ isActive: 1 });
GuiderSchema.index({ rating: -1 });
GuiderSchema.index({ pricePerHour: 1 });
GuiderSchema.index({ 'availability.date': 1 });
GuiderSchema.index({ tourTypes: 1 });
GuiderSchema.index({ specializations: 1 });
GuiderSchema.index({ indianStates: 1 });
GuiderSchema.index({ indianCities: 1 });
GuiderSchema.index({ isFeatured: 1 });
