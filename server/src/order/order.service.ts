import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        window: {
          include: {
            canteen: true,
          },
        },
        student: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findStudentOrders(studentId: string) {
    return this.prisma.order.findMany({
      where: { studentId },
      include: {
        window: {
          include: {
            canteen: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findWindowOrders(windowId: string) {
    return this.prisma.order.findMany({
      where: { windowId },
      include: {
        student: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        window: {
          include: {
            canteen: true,
          },
        },
        student: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
