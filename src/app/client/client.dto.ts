import { IsNotEmpty } from 'class-validator';

export class ClientDto {
  @IsNotEmpty()
  client_code: string;

  @IsNotEmpty()
  client_name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  number_phone: string;

  @IsNotEmpty()
  social_network: string;

  note: string;
}
