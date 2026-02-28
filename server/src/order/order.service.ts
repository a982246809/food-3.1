import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  async findAll(user: any) {
    let whereClause = {};
    if (user.role === Role.MERCHANT) {
      if (user.windowId) {
        whereClause = { windowId: user.windowId };
      } else if (user.canteenId) {
        const windows = await this.prisma.window.findMany({ where: { canteenId: user.canteenId } });
        whereClause = { windowId: { in: windows.map(w => w.id) } };
      }
    } else if (user.role === Role.STUDENT) {
      whereClause = { studentId: user.id };
    }

    return this.prisma.order.findMany({
      where: whereClause,
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

  async refund(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id } });
      if (!order || order.status === 'CANCELLED') {
        throw new Error('Order cannot be refunded');
      }
      
      // 退还金额
      await tx.user.update({
        where: { id: order.studentId },
        data: { balance: { increment: order.totalPrice } }
      });
      
      // 更新为取消/退款状态
      return tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });
    });
  }
}
