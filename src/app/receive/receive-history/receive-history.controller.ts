import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';

import { ReceiveHistoryService } from './receive-history.service';

@Controller('api/receive-history')
export class ReceiveHistoryController {
  constructor(private readonly receiveHistoryService: ReceiveHistoryService) {}
  @Get()
  getAllReceiveHistory(@Query() pagination: PaginationDto) {
    return this.receiveHistoryService.getAllReceiveHistory(pagination);
  }

  @Get(':id')
  getOneReceiveHistory(@Param('id') id: string) {
    return this.receiveHistoryService.getOneReceiveHistory(id);
  }
}
