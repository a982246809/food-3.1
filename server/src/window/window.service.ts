import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWindowDto } from './dto/create-window.dto.js';
import { UpdateWindowDto } from './dto/update-window.dto.js';

@Injectable()
export class WindowService {
  constructor(private prisma: PrismaService) {}

  create(createWindowDto: CreateWindowDto) {
    return this.prisma.window.create({
      data: createWindowDto,
    });
  }

  findAll(canteenId?: string) {
    return this.prisma.window.findMany({
      where: canteenId ? { canteenId } : undefined,
      include: {
        canteen: true,
        dishes: {
          where: { isOnSale: true },
          orderBy: { createdAt: 'desc' },
        },
        merchants: {
          select: { id: true, username: true },
        },
      },
    });
  }

  findByCanteen(canteenId: string) {
    return this.prisma.window.findMany({
      where: { canteenId },
    });
  }

  findOne(id: string) {
    return this.prisma.window.findUnique({
      where: { id },
      include: {
        canteen: true,
      },
    });
  }

  update(id: string, updateWindowDto: UpdateWindowDto) {
    return this.prisma.window.update({
      where: { id },
      data: updateWindowDto,
    });
  }

  remove(id: string) {
    return this.prisma.window.delete({
      where: { id },
    });
  }
}
