import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
export class PaginationDto {
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @Type(() => Date)
  @IsDate()
  toDate?: Date;

  pageIndex?: number;
  pageSize?: number;
}
