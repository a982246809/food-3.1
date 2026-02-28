import { Module } from '@nestjs/common';
import { CanteenService } from './canteen.service.js';
import { CanteenController } from './canteen.controller.js';

@Module({
  controllers: [CanteenController],
  providers: [CanteenService],
})
export class CanteenModule {}
