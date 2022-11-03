import { IsNotEmpty } from 'class-validator';

export class SupplierDto {
  @IsNotEmpty()
  supplier_code: string;

  @IsNotEmpty()
  supplier_name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  number_phone: string;

  note: string;
}
