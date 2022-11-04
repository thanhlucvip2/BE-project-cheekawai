import { IsNotEmpty } from 'class-validator';

export class ReceiveDto {
  @IsNotEmpty()
  received_code: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  quantity_received: number;

  @IsNotEmpty()
  transport_fee: number;

  size: string;

  color: string;

  @IsNotEmpty()
  status: string;

  note: string;

  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  supplier_code: string;

  product_type?: {
    sku: string;
    description: string;
    note: string;
  };
}
