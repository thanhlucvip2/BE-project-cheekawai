import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ProductTypeEntity } from '../../@entity/product_type.entity';
import { SupplierEntity } from '../../@entity/supplier.entity';
import { ReceiveHistoryEntity } from '../../@entity/receive-history.entity';
import { ReceiveDto } from '../../dto/receive.dto';
import { ReceiveEntity } from '../../@entity/receive.entity';
import { adddate, convertDateTimeToDateString } from 'src/@helpers/sql.helper';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class ReceiveService {
  constructor(
    @InjectRepository(ReceiveEntity)
    private readonly receiveRepository: Repository<ReceiveEntity>,
    @InjectRepository(ReceiveHistoryEntity)
    private readonly receiveHistoryRepository: Repository<ReceiveHistoryEntity>,
    @InjectRepository(ProductTypeEntity)
    private readonly productRepository: Repository<ProductTypeEntity>,
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    private emBi: EntityManager,
  ) {}

  async getAllReceive(pagination: PaginationDto) {
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

  async getOneReceive(id: string) {
    const receive = await this.receiveRepository.findOne({
      where: { id },
      relations: ['product_type', 'supplier'],
    });
    if (!receive) {
      throw new HttpException(
        'Mã đơn nhập hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    return receive;
  }

  async createReceive(body: ReceiveDto) {
    const product_type = await this.productRepository.findOne({
      where: { sku: body.sku },
    });

    const supplier = await this.supplierRepository.findOne({
      where: { supplier_code: body.supplier_code },
    });

    if (!supplier) {
      throw new HttpException(
        'Mã chủ hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!product_type) {
      throw new HttpException(
        'Mã hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    const receive = await this.receiveRepository.create({
      ...body,
      product_type,
      supplier,
    });
    this.createReceiveHistory(receive);
    return await this.receiveRepository.save(receive);
  }

  private createReceiveHistory(receive: ReceiveDto) {
    this.receiveHistoryRepository.save(receive);
  }
}
