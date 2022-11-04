import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/@systems/auth.guard';
import { ClientDto } from '../../dto/client.dto';
import { ClientService } from './client.service';

@Controller('api/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllProductType() {
    return await this.clientService.getAllClient();
  }

  @Get(':id')
  @UseGuards(new AuthGuard()) // check token
  async getOneProductType(@Param('id') id: string) {
    return await this.clientService.getOneClient(id);
  }

  @Post()
  @UseGuards(new AuthGuard()) // check token
  async createProductType(@Body() body: ClientDto) {
    return await this.clientService.createClient(body);
  }

  @Put(':id')
  @UseGuards(new AuthGuard()) // check token
  async updateProductType(@Body() body: ClientDto, @Param('id') id: string) {
    return await this.clientService.updateClient(id, body);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard()) // check token
  async deleteProductType(@Param('id') id: string) {
    return await this.clientService.deleteClient(id);
  }
}
