import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesController } from './guides.controller';
import { GuidesService } from './guides.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [GuidesController],
  providers: [GuidesService],
  exports: [GuidesService],
})
export class GuidesModule {} 