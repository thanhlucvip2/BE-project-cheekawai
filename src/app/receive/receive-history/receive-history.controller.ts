import { Controller, Get, Param } from '@nestjs/common';
import { ReceiveHistoryService } from './receive-history.service';

@Controller('api/receive-history')
export class ReceiveHistoryController {
  constructor(private readonly receiveHistoryService: ReceiveHistoryService) {}
  @Get()
  getAllReceiveHistory() {
    return this.receiveHistoryService.getAllReceiveHistory();
  }

  @Get(':id')
  getOneReceiveHistory(@Param('id') id: string) {
    return this.receiveHistoryService.getOneReceiveHistory(id);
  }
}
