import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StatisticsService } from './statistics.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  getDashboardData(@Request() req) {
    // 假设 req.user 里有 canteenId 或 windowId
    const user = req.user;
    return this.statisticsService.getDashboardData(user);
  }

  @Get('sales-chart')
  getSalesChartData(@Request() req) {
    const user = req.user;
    return this.statisticsService.getSalesChartData(user);
  }

  @Get('top-dishes')
  getTopDishes(@Request() req) {
    const user = req.user;
    return this.statisticsService.getTopDishes(user);
  }
}
