export class CreateDishDto {
  name: string;
  windowId: string;
  price: number;
  stock?: number;
  isSpecial?: boolean;
  imageUrl?: string;
}
