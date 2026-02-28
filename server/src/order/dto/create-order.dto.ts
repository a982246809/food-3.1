export class CreateOrderDto {
  studentId: string;
  windowId: string;
  items: any;
  totalPrice: number;
  remark?: string;
  pickupTime?: Date;
}
