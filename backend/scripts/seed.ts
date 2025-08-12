import { connect, disconnect } from 'mongoose';
import * as bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Connect to MongoDB
    const connection = await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tourmate');
    console.log('Connected to MongoDB');

    // Get the database
    const db = connection.connection.db;
    const usersCollection = db.collection('users');

    // Clear existing data
    await usersCollection.deleteMany({});
    console.log('Cleared existing data');

    // Create sample guides
    const guidePassword = await bcrypt.hash('password123', 12);
    
    const guides = [
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: guidePassword,
        role: 'guide',
        bio: 'Experienced local guide with 5+ years showing visitors around the city. I love sharing the hidden gems and authentic experiences.',
        languages: ['English', 'Spanish'],
        experienceYears: 5,
        locations: ['New York', 'Brooklyn', 'Manhattan'],
        pricePerHour: 25,
        pricePerDay: 200,
        rating: 4.8,
        phoneNumber: '+1-555-0123',
        availability: [
          { date: '2024-01-15', slots: ['09:00', '14:00', '18:00'] },
          { date: '2024-01-16', slots: ['10:00', '15:00', '19:00'] },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Maria Garcia',
        email: 'maria@example.com',
        password: guidePassword,
        role: 'guide',
        bio: 'Bilingual guide specializing in cultural tours and food experiences. Let me show you the real local culture!',
        languages: ['English', 'Spanish', 'Portuguese'],
        experienceYears: 3,
        locations: ['Miami', 'Orlando', 'Tampa'],
        pricePerHour: 30,
        pricePerDay: 240,
        rating: 4.9,
        phoneNumber: '+1-555-0124',
        availability: [
          { date: '2024-01-15', slots: ['08:00', '12:00', '16:00'] },
          { date: '2024-01-16', slots: ['09:00', '13:00', '17:00'] },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'David Chen',
        email: 'david@example.com',
        password: guidePassword,
        role: 'guide',
        bio: 'History enthusiast and architecture expert. I provide in-depth historical context for all the landmarks we visit.',
        languages: ['English', 'Mandarin'],
        experienceYears: 7,
        locations: ['San Francisco', 'Oakland', 'Berkeley'],
        pricePerHour: 35,
        pricePerDay: 280,
        rating: 4.7,
        phoneNumber: '+1-555-0125',
        availability: [
          { date: '2024-01-15', slots: ['10:00', '14:00', '18:00'] },
          { date: '2024-01-16', slots: ['11:00', '15:00', '19:00'] },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Create sample tourists
    const touristPassword = await bcrypt.hash('password123', 12);
    
    const tourists = [
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: touristPassword,
        role: 'tourist',
        phoneNumber: '+1-555-0126',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: touristPassword,
        role: 'tourist',
        phoneNumber: '+1-555-0127',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const admin = {
      name: 'Admin User',
      email: 'admin@tourmate.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert all users
    const result = await usersCollection.insertMany([...guides, ...tourists, admin]);
    console.log(`Created ${result.insertedCount} users`);

    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData(); 