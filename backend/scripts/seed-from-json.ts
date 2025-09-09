import { connect, disconnect } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

interface SeedOptions {
  clearData?: boolean;
  seedUsers?: boolean;
  seedGuiders?: boolean;
  seedReviews?: boolean;
  seedBookings?: boolean;
  seedAll?: boolean;
  dataFile?: string;
}

const loadSeedData = (dataFile: string) => {
  try {
    const filePath = path.join(__dirname, '..', dataFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Error loading seed data from ${dataFile}:`, error);
    process.exit(1);
  }
};

const seedData = async (options: SeedOptions = {}) => {
  const {
    clearData = true,
    seedUsers = true,
    seedGuiders = true,
    seedReviews = true,
    seedBookings = true,
    seedAll = false,
    dataFile = 'data/seed-data.json',
  } = options;

  try {
    // Load seed data from JSON file
    console.log(`📂 Loading seed data from ${dataFile}...`);
    const seedData = loadSeedData(dataFile);

    // Connect to MongoDB
    const connection = await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tourist-guider');
    console.log('🔌 Connected to MongoDB');

    // Get the database
    const db = connection.connection.db;
    const usersCollection = db.collection('users');
    const guidersCollection = db.collection('guiders');
    const reviewsCollection = db.collection('reviews');
    const bookingsCollection = db.collection('bookings');

    // Clear existing data if requested
    if (clearData || seedAll) {
      await usersCollection.deleteMany({});
      await guidersCollection.deleteMany({});
      await reviewsCollection.deleteMany({});
      await bookingsCollection.deleteMany({});
      console.log('🧹 Cleared existing data');
    }

    let guiderIds: any[] = [];
    let touristIds: any[] = [];

    // Seed users (tourists)
    if (seedUsers || seedAll) {
      console.log('👥 Seeding users (tourists)...');
      
      const touristPassword = await bcrypt.hash(seedData.passwords.tourist, 12);
      const adminPassword = await bcrypt.hash(seedData.passwords.admin, 12);

      // Prepare tourists with passwords and timestamps
      const tourists = seedData.tourists.map((tourist: any) => ({
        firstName: tourist.firstName,
        lastName: tourist.lastName,
        email: tourist.email,
        mobile: tourist.mobile,
        city: tourist.city,
        passwordHash: touristPassword,
        isVerified: true,
        profilePictureUrl: tourist.profilePictureUrl,
        travelStyle: tourist.travelStyle,
        preferredCategories: tourist.preferredCategories,
        travelPreferences: tourist.travelPreferences,
        badges: tourist.badges || [],
        tourPoints: tourist.tourPoints || 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Prepare admin user
      const admin = {
        firstName: seedData.admin.firstName,
        lastName: seedData.admin.lastName,
        email: seedData.admin.email,
        mobile: seedData.admin.mobile,
        city: seedData.admin.city,
        passwordHash: adminPassword,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const usersResult = await usersCollection.insertMany([...tourists, admin]);
      console.log(`✅ Created ${usersResult.insertedCount} users`);

      // Get the inserted user IDs for creating reviews and bookings
      const insertedUsers = await usersCollection.find({}).toArray();
      touristIds = insertedUsers.filter(user => user.email !== seedData.admin.email).map(user => user._id);
    }

    // Seed guiders
    if (seedGuiders || seedAll) {
      console.log('👨‍🏫 Seeding guiders...');
      
      const guiderPassword = await bcrypt.hash(seedData.passwords.guider, 12);

      // Prepare guiders with passwords and timestamps
      const guiders = seedData.guiders.map((guider: any) => ({
        showcaseName: guider.showcaseName,
        email: guider.email,
        mobile: guider.mobile,
        passwordHash: guiderPassword,
        guiderType: guider.guiderType,
        city: guider.city,
        overview: guider.overview,
        isVerified: true,
        basicDetailsCompleted: true,
        videoUploaded: true,
        eSignCompleted: true,
        approvalStatus: 'approved',
        companyName: guider.companyName,
        foundingDate: guider.foundingDate ? new Date(guider.foundingDate) : undefined,
        websiteUrl: guider.websiteUrl,
        socialMediaProfile: guider.socialMediaProfile,
        fullName: guider.fullName,
        languagesKnown: guider.languagesKnown,
        hasVehicle: guider.hasVehicle,
        vehicleDescription: guider.vehicleDescription,
        isExperienced: guider.isExperienced,
        tourTypes: guider.tourTypes,
        specializations: guider.specializations,
        certifications: guider.certifications,
        pricePerHour: guider.pricePerHour,
        pricePerDay: guider.pricePerDay,
        pricePerTour: guider.pricePerTour,
        currency: guider.currency || 'INR',
        rating: guider.rating,
        totalReviews: guider.totalReviews,
        totalTours: guider.totalTours,
        responseTime: guider.responseTime,
        cancellationPolicy: guider.cancellationPolicy,
        tourDurations: guider.tourDurations,
        groupSizes: guider.groupSizes,
        accessibility: guider.accessibility,
        availability: guider.availability,
        gallery: guider.gallery || [],
        highlights: guider.highlights,
        aboutMe: guider.aboutMe,
        whyChooseMe: guider.whyChooseMe,
        languagesSpoken: guider.languagesSpoken,
        education: guider.education,
        awards: guider.awards || [],
        isFeatured: guider.isFeatured,
        indianStates: guider.indianStates,
        indianCities: guider.indianCities,
        indianLanguages: guider.indianLanguages,
        indianCuisines: guider.indianCuisines,
        indianFestivals: guider.indianFestivals,
        hasGSTNumber: guider.hasGSTNumber,
        gstNumber: guider.gstNumber,
        tourPoints: guider.tourPoints || 0,
        badges: guider.badges || [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const guidersResult = await guidersCollection.insertMany(guiders);
      console.log(`✅ Created ${guidersResult.insertedCount} guiders`);

      // Get the inserted guider IDs
      const insertedGuiders = await guidersCollection.find({}).toArray();
      guiderIds = insertedGuiders.map(guider => guider._id);
    }

    // Seed bookings
    if ((seedBookings || seedAll) && guiderIds.length > 0 && touristIds.length > 0) {
      console.log('📅 Seeding bookings...');
      
      // Create a map of email to user ID for easy lookup
      const insertedUsers = await usersCollection.find({}).toArray();
      const insertedGuiders = await guidersCollection.find({}).toArray();
      const emailToUserIdMap = new Map();
      const emailToGuiderIdMap = new Map();
      
      insertedUsers.forEach(user => {
        emailToUserIdMap.set(user.email, user._id);
      });
      
      insertedGuiders.forEach(guider => {
        emailToGuiderIdMap.set(guider.email, guider._id);
      });

      const bookings = seedData.bookings.map((booking: any) => ({
        touristId: emailToUserIdMap.get(booking.touristEmail),
        guideId: emailToGuiderIdMap.get(booking.guiderEmail),
        place: booking.place,
        startDate: new Date(booking.startDate),
        durationHours: booking.durationHours,
        numPeople: booking.numPeople,
        specialRequests: booking.specialRequests,
        price: booking.price,
        status: booking.status,
        paymentIntentId: booking.paymentIntentId,
        isPaid: booking.isPaid || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const bookingsResult = await bookingsCollection.insertMany(bookings);
      console.log(`✅ Created ${bookingsResult.insertedCount} bookings`);
    }

    // Seed reviews
    if ((seedReviews || seedAll) && guiderIds.length > 0 && touristIds.length > 0) {
      console.log('⭐ Seeding reviews...');
      
      // Create maps for email to ID lookup
      const insertedUsers = await usersCollection.find({}).toArray();
      const insertedGuiders = await guidersCollection.find({}).toArray();
      const emailToUserIdMap = new Map();
      const emailToGuiderIdMap = new Map();
      
      insertedUsers.forEach(user => {
        emailToUserIdMap.set(user.email, user._id);
      });
      
      insertedGuiders.forEach(guider => {
        emailToGuiderIdMap.set(guider.email, guider._id);
      });
      
      // Get bookings to link reviews
      const bookings = await bookingsCollection.find({}).toArray();
      const bookingMap = new Map();
      bookings.forEach(booking => {
        const key = `${booking.touristId}_${booking.guideId}`;
        bookingMap.set(key, booking._id);
      });

      const reviews = seedData.reviews.map((review: any) => {
        const touristId = emailToUserIdMap.get(review.touristEmail);
        const guideId = emailToGuiderIdMap.get(review.guiderEmail);
        const key = `${touristId}_${guideId}`;
        const bookingId = bookingMap.get(key);

        return {
          bookingId: bookingId,
          touristId: touristId,
          guideId: guideId,
          rating: review.rating,
          comment: review.comment,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }).filter(review => review.bookingId); // Only include reviews with valid bookings

      const reviewsResult = await reviewsCollection.insertMany(reviews);
      console.log(`✅ Created ${reviewsResult.insertedCount} reviews`);
    }

    console.log('\n🎉 Seed data inserted successfully!');
    console.log('\n📋 Sample login credentials:');
    console.log(`👨‍💼 Admin: ${seedData.admin.email} / ${seedData.passwords.admin}`);
    console.log(`👨‍🏫 Guider: ${seedData.guiders[0].email} / ${seedData.passwords.guider}`);
    console.log(`👤 Tourist: ${seedData.tourists[0].email} / ${seedData.passwords.tourist}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const options: SeedOptions = {};

if (args.includes('--all') || args.includes('-a')) {
  options.seedAll = true;
} else {
  if (args.includes('--users') || args.includes('-u')) options.seedUsers = true;
  if (args.includes('--guiders') || args.includes('-g')) options.seedGuiders = true;
  if (args.includes('--reviews') || args.includes('-r')) options.seedReviews = true;
  if (args.includes('--bookings') || args.includes('-b')) options.seedBookings = true;
  if (args.includes('--no-clear')) options.clearData = false;
}

// Check for custom data file
const dataFileIndex = args.indexOf('--data-file');
if (dataFileIndex !== -1 && dataFileIndex + 1 < args.length) {
  options.dataFile = args[dataFileIndex + 1];
}

// If no specific options provided, seed everything
if (!options.seedAll && !options.seedUsers && !options.seedGuiders && !options.seedReviews && !options.seedBookings) {
  options.seedAll = true;
}

console.log('🌱 Starting database seeding from JSON...');
console.log('Options:', options);

seedData(options);
