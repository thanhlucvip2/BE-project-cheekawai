import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SupplierDto } from './supplier.dto';
import { SupplierEntity } from '../../@entity/supplier.entity';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ReceiveEntity } from 'src/@entity/receive.entity';
import { adddate, convertDateTimeToDateString } from 'src/@helpers/sql.helper';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    private emBi: EntityManager,
  ) {}

  async getAllSupplier(pagination: PaginationDto) {
    const {
      fromDate = new Date(),
      toDate = new Date(),
      pageIndex = 0,
      pageSize = 10,
    } = pagination;

    const sqlFromDate = convertDateTimeToDateString(fromDate);
    const sqlToDate = convertDateTimeToDateString(adddate(toDate, 1)); // tặng thêm 1 ngày cho date hiện tại

    const queryBuilder = await this.emBi
      .createQueryBuilder(SupplierEntity, 'supplier')
      .leftJoinAndSelect('supplier.receives', 'receives') // relation ship
      .andWhere('supplier.created >= :sqlFromDate', { sqlFromDate })
      .andWhere('supplier.created <= :sqlToDate', { sqlToDate })
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

  async getOneSupplier(id: string) {
    return this.supplierRepository.findOne({
      where: [{ id }],
      relations: ['receives'],
    });
  }

  async createSupplier(body: SupplierDto) {
    // check xem mã nhà cung cấp có tồn tại trong database chưa
    const supplier_code = await this.supplierRepository.findOne({
      where: { supplier_code: body.supplier_code },
    });
    if (supplier_code) {
      throw new HttpException(
        'Mã nhà cung cấp đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newSupplier = this.supplierRepository.create(body);

    return await this.supplierRepository.save(newSupplier);
  }
  async updateSupplier(id: string, body: SupplierDto) {
    const checkSupplierCode = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!checkSupplierCode) {
      throw new HttpException(
        'Mã chủ hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.supplierRepository.update({ id }, body);
    return await this.supplierRepository.findOne({ where: { id } });
  }

  async deleteSupplier(id: string) {
    await this.supplierRepository.delete(id);
    return {
      delete: true,
    };
  }
}
