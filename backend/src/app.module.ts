import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { DishesModule } from './dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, DishesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
