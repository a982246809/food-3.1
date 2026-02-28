import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ComplaintService } from './complaint.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('complaint')
@UseGuards(JwtAuthGuard)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Get()
  findAll() {
    return this.complaintService.findAll();
  }

  @Post()
  create(@Body() body: { studentId: string; content: string }) {
    return this.complaintService.create(body.studentId, body.content);
  }

  @Put(':id/reply')
  reply(@Param('id') id: string, @Body() body: { reply: string }) {
    return this.complaintService.reply(id, body.reply);
  }
}
