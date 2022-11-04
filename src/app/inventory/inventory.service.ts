import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from '../../@entity/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepository: Repository<InventoryEntity>,
  ) {}
  async getAllInventory() {
    return await this.inventoryRepository.find({
      relations: ['product_type', 'supplier'],
    });
  }
  async getDetailInventory(id: string) {
    return await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product_type', 'supplier'],
    });
  }
}
