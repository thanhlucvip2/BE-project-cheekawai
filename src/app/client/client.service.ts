import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientDto } from './client.dto';
import { ClientEntity } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async getAllClient() {
    return await this.clientRepository.find();
  }

  async getOneClient(id: string) {
    return this.clientRepository.findOne({ where: { id } });
  }

  async createClient(body: ClientDto) {
    // check xem mã khách hàng có tồn tại trong database chưa
    const client_code = await this.clientRepository.findOne({
      where: { client_code: body.client_code },
    });
    if (client_code) {
      throw new HttpException(
        'Mã khách hàng đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newClient = this.clientRepository.create(body);

    return await this.clientRepository.save(newClient);
  }

  async updateClient(id: string, body: ClientDto) {
    const checkClientCode = await this.clientRepository.findOne({
      where: { id },
    });

    if (!checkClientCode) {
      throw new HttpException(
        'Mã khách hàng không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.clientRepository.update({ id }, body);
    return await this.clientRepository.findOne({ where: { id } });
  }

  async deleteClient(id: string) {
    await this.clientRepository.delete(id);
    return {
      delete: true,
    };
  }
}
