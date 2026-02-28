import { Module } from '@nestjs/common';
import { DishService } from './dish.service.js';
import { DishController } from './dish.controller.js';

@Module({
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
