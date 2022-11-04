import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/@systems/auth.guard';
import { ValidationPipe } from 'src/@systems/validation.pipe';
import { ReceiveHistoryService } from './receive-history/receive-history.service';
import { ReceiveDto } from '../../dto/receive.dto';
import { ReceiveService } from './receive.service';

@Controller('api/receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}
  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllProductType() {
    return await this.receiveService.getAllReceive();
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
}
