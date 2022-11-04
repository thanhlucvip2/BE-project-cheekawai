export class ReceiveHistoryDto {
  received_code: string;
  quantity: number;
  quantity_received: number;
  transport_fee: number;
  size: string;
  color: string;
  status: string;
  note: string;
  sku: string;
  supplier_code: string;
  receive_history_date: Date;
  product_type?: {
    sku: string;
    description: string;
    note: string;
  };
}
