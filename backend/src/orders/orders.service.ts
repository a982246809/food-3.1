import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { merchantId, items } = createOrderDto;

    // Fetch dishes to calculate total and verify stock
    const dishIds = items.map((item) => item.dishId);
    const dishes = await this.prisma.dish.findMany({
      where: { id: { in: dishIds } },
    });

    if (dishes.length !== items.length) {
      throw new BadRequestException('Some dishes not found');
    }

    let total = 0;
    const orderItemsData = items.map((item) => {
      const dish = dishes.find((d) => d.id === item.dishId);
      if (!dish) throw new BadRequestException('Dish not found');
      if (dish.stock < item.quantity) {
        throw new BadRequestException(`Dish ${dish.name} is out of stock`);
      }
      total += Number(dish.price) * item.quantity;
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
      };
    });

    // Transaction to create order and decrease stock (optional for stock)
    // For simplicity, just create order
    return this.prisma.order.create({
      data: {
        studentId: userId,
        merchantId,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: { include: { dish: true } } },
    });
  }

  findAll(userId: number, role: string) {
    const where = role === 'MERCHANT' ? { merchantId: userId } : { studentId: userId };
    return this.prisma.order.findMany({
      where,
      include: { items: { include: { dish: true } }, student: true, merchant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { dish: true } } },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }
}
