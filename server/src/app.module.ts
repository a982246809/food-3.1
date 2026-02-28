import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CanteenModule } from './canteen/canteen.module.js';
import { WindowModule } from './window/window.module.js';
import { DishModule } from './dish/dish.module.js';
import { OrderModule } from './order/order.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CanteenModule,
    WindowModule,
    DishModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
