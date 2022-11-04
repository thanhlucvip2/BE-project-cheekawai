import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { adddate, convertDateTimeToDateString } from 'src/@helpers/sql.helper';
import { PaginationDto } from 'src/dto/pagination.dto';
import { EntityManager, Repository } from 'typeorm';
import { InventoryEntity } from '../../@entity/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepository: Repository<InventoryEntity>,
    private emBi: EntityManager,
  ) {}
  async getAllInventory(pagination: PaginationDto) {
    // return await this.inventoryRepository.find({
    //   relations: ['product_type', 'supplier'],
    // });

    const {
      fromDate = new Date(),
      toDate = new Date(),
      pageIndex = 0,
      pageSize = 10,
    } = pagination;

    const sqlFromDate = convertDateTimeToDateString(fromDate);
    const sqlToDate = convertDateTimeToDateString(adddate(toDate, 1)); // tặng thêm 1 ngày cho date hiện tại

    const queryBuilder = await this.emBi
      .createQueryBuilder(InventoryEntity, 'inventory')
      .leftJoinAndSelect('inventory.product_type', 'product_type') // relation ship
      .leftJoinAndSelect('inventory.supplier', 'supplier') // relation ship
      .andWhere('inventory.created >= :sqlFromDate', { sqlFromDate })
      .andWhere('inventory.created <= :sqlToDate', { sqlToDate })
      .limit(pageSize)
      .offset(pageIndex);

    const total = await queryBuilder.getCount();
    const items = await queryBuilder.getMany();
    return {
      pageIndex,
      pageSize,
      total,
      items,
    };
  }
  async getDetailInventory(id: string) {
    return await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product_type', 'supplier'],
    });
  }
}
