export class OrderItemDto {
  dishId!: number;
  quantity!: number;
}

export class CreateOrderDto {
  merchantId!: number;
  items!: OrderItemDto[];
}
