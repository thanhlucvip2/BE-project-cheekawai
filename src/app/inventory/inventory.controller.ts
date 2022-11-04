import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { InventoryService } from './inventory.service';

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get()
  async getAllInventory(@Query() pagination: PaginationDto) {
    return await this.inventoryService.getAllInventory(pagination);
  }

  @Get(':id')
  async getDetailInventory(@Param('id') id: string) {
    return await this.inventoryService.getDetailInventory(id);
  }
}
