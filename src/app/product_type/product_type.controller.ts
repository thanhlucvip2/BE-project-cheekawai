import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductTypeService } from './product_type.service';
import { ProductDto } from './product.dto';
import { AuthGuard } from 'src/shared/auth.guard';
@Controller('api/product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllProductType() {
    return await this.productTypeService.getAllProductType();
  }

  @Get(':id')
  @UseGuards(new AuthGuard()) // check token
  async getOneProductType(@Param('id') id: string) {
    return await this.productTypeService.getOneProductType(id);
  }

  @Post()
  @UseGuards(new AuthGuard()) // check token
  async createProductType(@Body() body: ProductDto) {
    return await this.productTypeService.createProductType(body);
  }

  @Put(':id')
  @UseGuards(new AuthGuard()) // check token
  async updateProductType(@Body() body: ProductDto, @Param('id') id: string) {
    return await this.productTypeService.updateProductType(id, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard()) // check token
  async deleteProductType(@Param('id') id: string) {
    return await this.productTypeService.deleteProductType(id);
  }
}
