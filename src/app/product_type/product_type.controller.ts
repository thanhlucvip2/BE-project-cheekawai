import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ProductTypeService } from './product_type.service';
import { ProductDto } from '../../dto/product.dto';
import { AuthGuard } from 'src/@systems/auth.guard';
import { ValidationPipe } from 'src/@systems/validation.pipe';
import { PaginationDto } from 'src/dto/pagination.dto';
@Controller('api/product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllProductType(@Query() pagination: PaginationDto) {
    return await this.productTypeService.getAllProductType(pagination);
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
  @UsePipes(new ValidationPipe())
  async updateProductType(@Body() body: ProductDto, @Param('id') id: string) {
    return await this.productTypeService.updateProductType(id, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard()) // check token
  @UsePipes(new ValidationPipe())
  async deleteProductType(@Param('id') id: string) {
    return await this.productTypeService.deleteProductType(id);
  }
}
