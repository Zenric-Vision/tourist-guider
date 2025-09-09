import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesService } from './guides.service';
import { GuidesController } from './guides.controller';
import { Guider, GuiderSchema } from './schemas/guider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guider.name, schema: GuiderSchema },
    ]),
  ],
  controllers: [GuidesController],
  providers: [GuidesService],
  exports: [GuidesService],
})
export class GuidesModule {} 