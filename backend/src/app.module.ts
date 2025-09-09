import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GuidesModule } from './guides/guides.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
// import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
// import { UploadModule } from './upload/upload.module';
// import { EmailModule } from './email/email.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/tourmate'),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CommonModule,
    AuthModule,
    UsersModule,
    GuidesModule,
    BookingsModule,
    ReviewsModule,
    // PaymentsModule,
    AdminModule,
    // UploadModule,
    // EmailModule,
  ],
  controllers: [HealthController],
})
export class AppModule {} 