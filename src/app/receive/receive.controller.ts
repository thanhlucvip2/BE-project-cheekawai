import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  Query,
  Put,
} from '@nestjs/common';
import { AuthGuard } from 'src/@systems/auth.guard';
import { ValidationPipe } from 'src/@systems/validation.pipe';
import { ReceiveDto } from '../../dto/receive.dto';
import { ReceiveService } from './receive.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('api/receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}
  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllProductType(@Query() pagination: PaginationDto) {
    return await this.receiveService.getAllReceive(pagination);
  }

  @Get(':id')
  @UseGuards(new AuthGuard()) // check token
  async getOneProductType(@Param('id') id: string) {
    return await this.receiveService.getOneReceive(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard()) // check token
  async createReceive(@Body() body: ReceiveDto) {
    return this.receiveService.createReceive(body);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard()) // check token
  async updateReceive(@Body() body: ReceiveDto, @Param('id') id: string) {
    return this.receiveService.updateReceive(body, id);
  }
}
