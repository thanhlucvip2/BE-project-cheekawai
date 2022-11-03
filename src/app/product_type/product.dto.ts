import { IsNotEmpty } from 'class-validator';
export class ProductDto {
  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  description: string;

  note: string;
}
