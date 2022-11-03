import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { ReceiveDto } from './receive.dto';
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
