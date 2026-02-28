import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDishDto } from './dto/create-dish.dto.js';
import { UpdateDishDto } from './dto/update-dish.dto.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  create(createDishDto: CreateDishDto, user: any) {
    if (user.role === Role.MERCHANT && user.windowId && !createDishDto.windowId) {
      createDishDto.windowId = user.windowId;
    }
    return this.prisma.dish.create({
      data: createDishDto,
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
    }

    return this.prisma.dish.findMany({
      where: whereClause,
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
