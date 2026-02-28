import { request } from '../request';

export function fetchDashboardData() {
  return request<{ orderCount: number; salesAmount: number; }>({ url: '/statistics/dashboard' });
}

export function fetchSalesChartData() {
  return request<{ dates: string[]; sales: number[]; }>({ url: '/statistics/sales-chart' });
}

export function fetchTopDishes() {
  return request<{ name: string; price: number; count: number; }[]>({ url: '/statistics/top-dishes' });
}
