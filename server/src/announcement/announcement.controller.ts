import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('announcement')
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  findAll() {
    return this.announcementService.findAll();
  }

  @Post()
  create(@Body() body: { title: string; content: string; authorId: string }) {
    return this.announcementService.create(body.title, body.content, body.authorId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.remove(id);
  }
}
