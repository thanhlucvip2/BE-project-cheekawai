import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierDto } from './supplier.dto';
import { SupplierEntity } from './supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
  ) {}

  async getAllSupplier() {
    return await this.supplierRepository.find({ relations: ['receives'] });
  }

  async getOneSupplier(id: string) {
    return this.supplierRepository.findOne({
      where: { id },
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
