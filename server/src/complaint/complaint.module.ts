import { Module } from '@nestjs/common';
import { ComplaintController } from './complaint.controller.js';
import { ComplaintService } from './complaint.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
