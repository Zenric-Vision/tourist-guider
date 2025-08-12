# TourMate - Tourist Guide Booking Platform

A full-stack web application that connects tourists with local guides for authentic travel experiences. Built with Next.js, NestJS, MongoDB, and TypeScript.

## 🚀 Features

### For Tourists
- **Search & Filter**: Find guides by location, date, language, price, and rating
- **Guide Profiles**: View detailed profiles with reviews, availability, and pricing
- **Booking System**: Easy booking process with payment integration
- **Review System**: Rate and review guides after tours
- **Dashboard**: Manage bookings, view history, and track upcoming tours

### For Guides
- **Profile Management**: Create detailed profiles with bio, languages, and pricing
- **Availability Calendar**: Set and manage availability slots
- **Booking Management**: Accept/reject booking requests
- **Earnings Dashboard**: Track earnings and completed tours
- **Review Management**: View and respond to tourist reviews

### For Admins
- **User Management**: View all users and manage accounts
- **Content Moderation**: Moderate reviews and reported content
- **Analytics**: View platform statistics and insights

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form handling with validation
- **Stripe** - Payment processing

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Authentication and authorization
- **Passport** - Authentication strategies
- **Stripe** - Payment processing
- **Swagger** - API documentation

### Infrastructure
- **Docker** - Containerization
- **MongoDB Atlas** - Cloud database (production)
- **Vercel** - Frontend deployment
- **Railway/Render** - Backend deployment

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)
- Docker (optional)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tourist-guider
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Seed the database**
   ```bash
   docker exec tourmate-backend npm run seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Docs: http://localhost:4000/api/docs

### Option 2: Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd tourist-guider
   npm run install:all
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Or install MongoDB locally
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the applications**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# App Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/tourmate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@tourmate.com
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:4000/api/docs for interactive API documentation.

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

#### Guides
- `GET /api/guides` - Search guides with filters
- `GET /api/guides/:id` - Get guide profile
- `PATCH /api/guides/availability` - Update guide availability

#### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/status` - Update booking status

#### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/guide/:id` - Get guide reviews

#### Payments
- `POST /api/payments/create-intent` - Create payment intent

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both applications
- `npm run test` - Run tests for both applications
- `npm run seed` - Seed the database with sample data

### Backend
- `npm run start:dev` - Start in development mode
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🗄 Database Schema

### User
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  role: "tourist" | "guide" | "admin",
  profilePicture?: string,
  phoneNumber?: string,
  bio?: string,
  languages?: string[],
  experienceYears?: number,
  locations?: string[],
  pricePerHour?: number,
  pricePerDay?: number,
  rating?: number,
  availability?: { date: string, slots: string[] }[],
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```typescript
{
  _id: ObjectId,
  touristId: ObjectId,
  guideId: ObjectId,
  place: string,
  startDate: Date,
  durationHours: number,
  numPeople: number,
  specialRequests?: string,
  price: number,
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled",
  paymentIntentId?: string,
  isPaid: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```typescript
{
  _id: ObjectId,
  bookingId: ObjectId,
  touristId: ObjectId,
  guideId: ObjectId,
  rating: number (1-5),
  comment?: string,
  createdAt: Date
}
```

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:

1. User registers/logs in
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Token is sent with each API request in Authorization header
5. Server validates token and extracts user information

## 💳 Payment Integration

Stripe is integrated for payment processing:

1. Client creates payment intent via API
2. Stripe returns client secret
3. Client confirms payment using Stripe Elements
4. Webhook updates booking status on successful payment

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push to main branch

### Database (MongoDB Atlas)
1. Create cluster in MongoDB Atlas
2. Get connection string
3. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@tourmate.com or create an issue in the repository.

## 🔄 Roadmap

- [ ] Real-time chat between tourists and guides
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Guide verification system
- [ ] Insurance integration
- [ ] Group booking features
- [ ] Virtual tour previews 