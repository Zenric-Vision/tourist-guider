# Tourist Guider - India's Premier Local Guide Platform

A comprehensive tour guide marketplace platform specifically designed for India, connecting travelers with verified local guides for authentic experiences across the country.

## 🌟 Features

### For Travelers
- **Advanced Search & Filtering**: Find guides by location, tour type, specializations, languages, and more
- **India-Specific Content**: Curated experiences across Indian states and cities
- **Verified Guides**: All guides are background-checked and rated
- **Multiple Tour Types**: Cultural, Adventure, Food, Historical, Spiritual, Wildlife, and more
- **Local Expertise**: Guides with deep knowledge of Indian culture, traditions, and hidden gems
- **Secure Booking**: Integrated payment system with Razorpay
- **Reviews & Ratings**: Authentic feedback from previous travelers
- **Multi-language Support**: Guides fluent in English, Hindi, and local languages

### For Guides
- **Comprehensive Profiles**: Detailed profiles with specializations, certifications, and gallery
- **India-Specific Fields**: GST numbers, Indian languages, cuisines, and festivals
- **Tour Management**: Easy availability management and booking handling
- **Earnings Dashboard**: Track bookings, reviews, and earnings
- **Verification System**: Get verified to build trust with travelers

### For Admins
- **User Management**: Manage guides, tourists, and platform content
- **Verification System**: Review and approve guide applications
- **Analytics Dashboard**: Track platform performance and user engagement
- **Content Moderation**: Monitor reviews and ensure quality

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Google OAuth
- **File Upload**: Multer for image handling
- **Email**: Nodemailer with Handlebars templates
- **Payment**: Razorpay integration
- **Validation**: Class-validator and class-transformer

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Authentication**: NextAuth.js
- **UI Components**: Heroicons and custom components
- **Payment**: Razorpay checkout

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Environment**: Node.js 18+
- **Database**: MongoDB Atlas (production) / Local MongoDB (development)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Docker (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tourist-guider
```

### 2. Environment Setup
```bash
# Copy environment files
cp env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Database Setup
```bash
# Start MongoDB (if using local)
docker-compose up -d mongodb

# Or use MongoDB Atlas (update connection string in .env)
```

### 5. Seed Database
```bash
cd backend
npm run seed:advanced
```

### 6. Start Development Servers
```bash
# Start backend (from backend directory)
npm run start:dev

# Start frontend (from frontend directory)
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api

## 📊 Sample Data

The seed script creates:

### Guides (6 Professional Profiles)
1. **Rajesh Kumar** - Mumbai Cultural & Food Guide
2. **Priya Sharma** - Rishikesh Spiritual & Yoga Guide  
3. **Amit Patel** - Wildlife Safari Expert
4. **Lakshmi Devi** - South Indian Cooking Expert
5. **Arjun Singh** - Rajasthan Heritage Expert
6. **Meera Iyer** - Kerala Backwaters Specialist

### Tourists (3 Sample Accounts)
- John Smith, Sarah Johnson, Michael Brown

### Admin
- Admin User for platform management

## 🔐 Authentication

### Login Credentials
```
Guide: rajesh.kumar@example.com / password123
Tourist: john.smith@example.com / password123  
Admin: admin@touristguider.com / admin123
```

## 🗺️ India-Specific Features

### States & Cities
- **15 Major States**: Maharashtra, Delhi, Karnataka, Tamil Nadu, etc.
- **50+ Cities**: Mumbai, Delhi, Bangalore, Chennai, Jaipur, Varanasi, etc.
- **Regional Specializations**: Each guide specializes in specific regions

### Tour Types
- **Cultural Tours**: Temples, palaces, traditional arts
- **Adventure Tours**: Trekking, wildlife safaris, outdoor activities
- **Food Tours**: Street food, traditional cuisine, cooking classes
- **Historical Tours**: Ancient monuments, heritage sites
- **Spiritual Tours**: Yoga, meditation, sacred sites
- **Nature Tours**: Backwaters, mountains, beaches
- **Architecture Tours**: Modern and historical buildings
- **Wildlife Tours**: National parks and sanctuaries

### Specializations
- Ancient Temples, Street Food, Yoga, Ayurveda
- Wildlife Photography, Heritage Sites, Local Markets
- Palace Tours, Cooking Classes, Village Tours

### Languages & Culture
- **15+ Indian Languages**: Hindi, English, regional languages
- **Indian Cuisines**: North Indian, South Indian, regional specialties
- **Festivals**: Diwali, Holi, Pongal, Onam, and more

## 🏛️ Architecture

### Backend Structure
```
backend/
├── src/
│   ├── auth/           # Authentication & authorization
│   ├── users/          # User management
│   ├── guides/         # Guide-specific features
│   ├── bookings/       # Booking management
│   ├── reviews/        # Review system
│   ├── payments/       # Payment processing
│   ├── upload/         # File upload handling
│   └── admin/          # Admin panel
```

### Frontend Structure
```
frontend/
├── app/                # Next.js app router
│   ├── auth/          # Authentication pages
│   ├── guides/        # Guide listing & profiles
│   ├── dashboard/     # User dashboards
│   └── admin/         # Admin panel
├── components/         # Reusable components
├── lib/               # API clients & utilities
└── types/             # TypeScript definitions
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/tourist-guider
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
```

## 🚀 Deployment

### Using Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

## 📱 API Endpoints

### Guides
- `GET /api/guides` - Search guides with filters
- `GET /api/guides/featured` - Get featured guides
- `GET /api/guides/destinations/popular` - Popular destinations
- `GET /api/guides/tour-types` - Available tour types
- `GET /api/guides/specializations` - Available specializations
- `GET /api/guides/:id` - Get guide profile
- `GET /api/guides/:id/similar` - Similar guides

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - User's bookings
- `PATCH /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/guide/:id` - Guide's reviews

### Payments
- `POST /api/payments/create-intent` - Create payment intent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@touristguider.com or create an issue in the repository.

## 🙏 Acknowledgments

- Inspired by ToursByLocals platform
- Built for the Indian tourism market
- Special thanks to all the local guides who inspired this platform

---

**Tourist Guider** - Connecting travelers with authentic Indian experiences through local expertise. 