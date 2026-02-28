import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCanteenDto } from './dto/create-canteen.dto.js';
import { UpdateCanteenDto } from './dto/update-canteen.dto.js';

@Injectable()
export class CanteenService {
  constructor(private prisma: PrismaService) {}

  create(createCanteenDto: CreateCanteenDto) {
    return this.prisma.canteen.create({
      data: createCanteenDto,
    });
  }

  findAll() {
    return this.prisma.canteen.findMany({
      include: {
        windows: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.canteen.findUnique({
      where: { id },
      include: {
        windows: true,
      },
    });
  }

  update(id: string, updateCanteenDto: UpdateCanteenDto) {
    return this.prisma.canteen.update({
      where: { id },
      data: updateCanteenDto,
    });
  }

  remove(id: string) {
    return this.prisma.canteen.delete({
      where: { id },
    });
  }
}
