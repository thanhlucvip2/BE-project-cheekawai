import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { AuthGuard } from 'src/@systems/auth.guard';
import { SupplierDto } from './supplier.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
@Controller('api/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllProductType(@Query() pagination: PaginationDto) {
    return await this.supplierService.getAllSupplier(pagination);
  }

  @Get(':id')
  @UseGuards(new AuthGuard()) // check token
  async getOneProductType(@Param('id') id: string) {
    return await this.supplierService.getOneSupplier(id);
  }

  @Post()
  @UseGuards(new AuthGuard()) // check token
  async createProductType(@Body() body: SupplierDto) {
    return await this.supplierService.createSupplier(body);
  }

  @Put(':id')
  @UseGuards(new AuthGuard()) // check token
  async updateProductType(@Body() body: SupplierDto, @Param('id') id: string) {
    return await this.supplierService.updateSupplier(id, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard()) // check token
  async deleteProductType(@Param('id') id: string) {
    return await this.supplierService.deleteSupplier(id);
  }
}
