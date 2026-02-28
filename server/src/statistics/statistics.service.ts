import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  private getWindowIds(user: any): Promise<string[]> {
    if (user.role === Role.ADMIN) {
      return this.prisma.window.findMany().then(ws => ws.map(w => w.id));
    }
    // 如果商家有具体的 windowId 则只能看自己的
    if (user.windowId) {
      return Promise.resolve([user.windowId]);
    }
    // 退化到根据 canteenId 查看
    if (user.canteenId) {
      return this.prisma.window.findMany({ where: { canteenId: user.canteenId } }).then(ws => ws.map(w => w.id));
    }
    return Promise.resolve([]);
  }

  async getDashboardData(user: any) {
    const windowIds = await this.getWindowIds(user);
    if (!windowIds.length) {
      return { orderCount: 0, salesAmount: 0, topDishes: [] };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const orders = await this.prisma.order.findMany({
      where: {
        windowId: { in: windowIds },
        createdAt: { gte: todayStart },
        status: { not: 'CANCELLED' } 
      }
    });

    const orderCount = orders.length;
    const salesAmount = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

    return {
      orderCount,
      salesAmount
    };
  }

  async getSalesChartData(user: any) {
    const windowIds = await this.getWindowIds(user);
    if (!windowIds.length) return { dates: [], sales: [] };

    // 简单以过去7天为例
    const data: { date: string, sales: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const orders = await this.prisma.order.findMany({
        where: {
          windowId: { in: windowIds },
          createdAt: { gte: start, lt: end },
          status: { not: 'CANCELLED' }
        }
      });
      data.push({
        date: `${start.getMonth() + 1}/${start.getDate()}`,
        sales: orders.reduce((sum, o) => sum + Number(o.totalPrice), 0),
      });
    }

    return {
      dates: data.map(d => d.date),
      sales: data.map(d => d.sales)
    };
  }

  async getTopDishes(user: any) {
    const windowIds = await this.getWindowIds(user);
    if (!windowIds.length) return [];

    // 这里应当通过聚合查询，由于 items 是 JSON，不太好直接全库聚合。
    // 我们找出最近一周的订单来计算排行
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const orders = await this.prisma.order.findMany({
      where: {
        windowId: { in: windowIds },
        createdAt: { gte: start },
        status: { not: 'CANCELLED' }
      }
    });

    const dishCountMap: Record<string, {name: string, count: number, price: number}> = {};
    
    for (const order of orders) {
      const items = order.items as any[];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (!dishCountMap[item.id]) {
            dishCountMap[item.id] = { name: item.name, price: Number(item.price), count: 0 };
          }
          dishCountMap[item.id].count += item.quantity;
        }
      }
    }

    const sortedDishes = Object.values(dishCountMap).sort((a, b) => b.count - a.count).slice(0, 10);
    return sortedDishes;
  }
}
