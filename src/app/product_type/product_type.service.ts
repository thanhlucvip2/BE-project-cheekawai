import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../../dto/product.dto';
import { ProductTypeEntity } from '../../@entity/product_type.entity';
@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductTypeEntity)
    private readonly productRepository: Repository<ProductTypeEntity>,
  ) {}

  async getAllProductType() {
    return await this.productRepository.find({ relations: ['receives'] });
  }

  async getOneProductType(id: string) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['receives'],
    });
  }

  async createProductType(body: ProductDto) {
    // check xem mã hàng có tồn tại trong database chưa
    const sku = await this.productRepository.findOne({
      where: { sku: body.sku },
    });
    if (sku) {
      throw new HttpException(
        'Mã hàng đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newProduct = this.productRepository.create(body);

    return await this.productRepository.save(newProduct);
  }

  async updateProductType(id: string, body: ProductDto) {
    const checkId = await this.productRepository.findOne({ where: { id } });
    // check mã hàng đã tồn tại chưa
    if (!checkId) {
      throw new HttpException(
        'Mã hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.productRepository.update({ id }, body);
    return await this.productRepository.findOne({ where: { id } });
  }

  async deleteProductType(id: string) {
    await this.productRepository.delete(id);
    return {
      delete: true,
    };
  }
}
