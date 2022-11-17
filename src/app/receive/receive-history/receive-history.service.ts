import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { adddate, convertDateTimeToDateString } from 'src/@helpers/sql.helper';
import { PaginationDto } from 'src/dto/pagination.dto';
import { EntityManager, Repository } from 'typeorm';
import { ReceiveHistoryEntity } from '../../../@entity/receive-history.entity';
@Injectable()
export class ReceiveHistoryService {
  constructor(
    @InjectRepository(ReceiveHistoryEntity)
    private readonly receiveHistoryRepository: Repository<ReceiveHistoryEntity>,
    private emBi: EntityManager,
  ) {}

  async getAllReceiveHistory(pagination: PaginationDto) {
    const {
      fromDate = new Date(),
      toDate = new Date(),
      pageIndex = 0,
      pageSize = 10,
    } = pagination;

    const sqlFromDate = convertDateTimeToDateString(fromDate);
    const sqlToDate = convertDateTimeToDateString(adddate(toDate, 1)); // tặng thêm 1 ngày cho date hiện tại

    const queryBuilder = await this.emBi
      .createQueryBuilder(ReceiveHistoryEntity, 'receive_history')
      .leftJoinAndSelect('receive_history.product_type', 'product_type') // relation ship
      .leftJoinAndSelect('receive_history.supplier', 'supplier') // relation ship
      .andWhere('receive_history.created >= :sqlFromDate', { sqlFromDate })
      .andWhere('receive_history.created <= :sqlToDate', { sqlToDate })
      .orderBy({ 'receive_history.created': 'DESC' })
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

  async getOneReceiveHistory(id: string) {
    return await this.receiveHistoryRepository.findOne({
      where: { id },
      relations: ['product_type', 'supplier'],
    });
  }
}
