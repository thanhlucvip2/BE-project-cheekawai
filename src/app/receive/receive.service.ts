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
import { StatusReceive } from 'src/common/enum/status';

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
      .createQueryBuilder(ReceiveEntity, 'receive')
      .leftJoinAndSelect('receive.product_type', 'product_type') // relation ship
      .leftJoinAndSelect('receive.supplier', 'supplier') // relation ship
      .andWhere('receive.created >= :sqlFromDate', { sqlFromDate })
      .andWhere('receive.created <= :sqlToDate', { sqlToDate })
      .orderBy({ 'receive.created': 'DESC' })
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

    const received_code = await this.receiveRepository.findOne({
      where: { received_code: body.received_code },
    });

    if (received_code) {
      // nếu mã đơn đã tồn tại thì chỉ update lại đơn
      throw new HttpException(
        'Mã đơn hàng đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    const receive = await this.receiveRepository.create({
      ...body,
      product_type,
      supplier,
    });

    // nếu số lượng xác nhận bằng số lượng nhập thì chuyển đơn thành trạng thái thành công
    if (receive.quantity_received === receive.quantity) {
      receive.status = StatusReceive.RECEIVE_SUCCESS;
    }
    this.createReceiveHistory(receive);
    return await this.receiveRepository.save(receive);
  }

  async updateReceive(body: ReceiveDto, id: string) {
    const receive = await this.receiveRepository.findOne({
      where: {
        sku: body.sku,
        supplier_code: body.supplier_code,
        id,
        received_code: body.received_code,
      },
    });

    if (!receive) {
      // nếu mã đơn đã tồn tại thì chỉ update lại đơn
      throw new HttpException(
        'Đơn hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (receive.status === StatusReceive.RECEIVE_SUCCESS) {
      throw new HttpException(
        'Đơn dã hoàn thành, bạn không được phép cập nhật lại',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newReceive = {
      ...body,
      quantity_received: +body.quantity_received,
      quantity: +body.quantity,
      transport_fee: +body.transport_fee,
    };

    if (newReceive.quantity_received > newReceive.quantity) {
      throw new HttpException(
        'Không được nhập quá số lượng của đơn hàng',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (newReceive.quantity_received === newReceive.quantity) {
      newReceive.status = StatusReceive.RECEIVE_SUCCESS;
    }

    this.createReceiveHistory(newReceive);
    await this.receiveRepository.update({ id }, newReceive);
    return await this.receiveRepository.findOne({ where: { id } });
  }

  private createReceiveHistory(body: ReceiveDto) {
    this.receiveHistoryRepository.save(body);
  }
}
