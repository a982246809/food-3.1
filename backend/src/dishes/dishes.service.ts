import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  create(createDishDto: CreateDishDto) {
    return this.prisma.dish.create({
      data: createDishDto,
    });
  }

  findAll() {
    return this.prisma.dish.findMany({
      include: { merchant: true },
    });
  }

  findOne(id: number) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { merchant: true },
    });
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    return this.prisma.dish.update({
      where: { id },
      data: updateDishDto,
    });
  }

  remove(id: number) {
    return this.prisma.dish.delete({
      where: { id },
    });
  }
}
