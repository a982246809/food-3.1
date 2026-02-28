import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.complaint.findMany({
      include: {
        student: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(studentId: string, content: string) {
    return this.prisma.complaint.create({
      data: { studentId, content },
    });
  }

  async reply(id: string, reply: string) {
    return this.prisma.complaint.update({
      where: { id },
      data: { reply, status: 'PROCESSED' },
    });
  }
}
