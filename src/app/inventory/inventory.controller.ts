import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get()
  async getAllInventory() {
    return await this.inventoryService.getAllInventory();
  }

  @Get(':id')
  async getDetailInventory(@Param('id') id: string) {
    return await this.inventoryService.getDetailInventory(id);
  }
}
