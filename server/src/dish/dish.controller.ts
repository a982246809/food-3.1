import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DishService } from './dish.service.js';
import { CreateDishDto } from './dto/create-dish.dto.js';
import { UpdateDishDto } from './dto/update-dish.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('dish')
@UseGuards(JwtAuthGuard)
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  create(@Request() req, @Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.dishService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }
}
