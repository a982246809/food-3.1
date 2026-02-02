export class CreateDishDto {
  name!: string;
  price!: number;
  description?: string;
  image?: string;
  stock?: number;
  merchantId!: number;
}
