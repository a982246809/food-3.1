import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CanteenService } from './canteen.service.js';
import { CreateCanteenDto } from './dto/create-canteen.dto.js';
import { UpdateCanteenDto } from './dto/update-canteen.dto.js';

@Controller('canteen')
export class CanteenController {
  constructor(private readonly canteenService: CanteenService) {}

  @Post()
  create(@Body() createCanteenDto: CreateCanteenDto) {
    return this.canteenService.create(createCanteenDto);
  }

  @Get()
  findAll() {
    return this.canteenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.canteenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCanteenDto: UpdateCanteenDto) {
    return this.canteenService.update(id, updateCanteenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.canteenService.remove(id);
  }
}
