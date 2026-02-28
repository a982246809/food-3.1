import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDishDto } from './dto/create-dish.dto.js';
import { UpdateDishDto } from './dto/update-dish.dto.js';

@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  create(createDishDto: CreateDishDto) {
    return this.prisma.dish.create({
      data: createDishDto,
    });
  }

  findAll() {
    return this.prisma.dish.findMany({
      include: {
        window: {
          include: {
            canteen: true,
          },
        },
      },
    });
  }

  findByWindow(windowId: string) {
    return this.prisma.dish.findMany({
      where: { windowId },
    });
  }

  findOne(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: {
        window: true,
      },
    });
  }

  update(id: string, updateDishDto: UpdateDishDto) {
    return this.prisma.dish.update({
      where: { id },
      data: updateDishDto,
    });
  }

  remove(id: string) {
    return this.prisma.dish.delete({
      where: { id },
    });
  }
}
