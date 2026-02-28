import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WindowService } from './window.service.js';
import { CreateWindowDto } from './dto/create-window.dto.js';
import { UpdateWindowDto } from './dto/update-window.dto.js';

@Controller('window')
export class WindowController {
  constructor(private readonly windowService: WindowService) {}

  @Post()
  create(@Body() createWindowDto: CreateWindowDto) {
    return this.windowService.create(createWindowDto);
  }

  @Get()
  findAll() {
    return this.windowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.windowService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWindowDto: UpdateWindowDto) {
    return this.windowService.update(id, updateWindowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.windowService.remove(id);
  }
}
