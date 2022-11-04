import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ClientDto } from '../../dto/client.dto';
import { ClientEntity } from '../../@entity/client.entity';
import { PaginationDto } from 'src/dto/pagination.dto';
import { adddate, convertDateTimeToDateString } from 'src/@helpers/sql.helper';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private emBi: EntityManager,
  ) {}

  async getAllClient(pagination: PaginationDto) {
    const {
      fromDate = new Date(),
      toDate = new Date(),
      pageIndex = 0,
      pageSize = 10,
    } = pagination;

    const sqlFromDate = convertDateTimeToDateString(fromDate);
    const sqlToDate = convertDateTimeToDateString(adddate(toDate, 1)); // tặng thêm 1 ngày cho date hiện tại

    const queryBuilder = await this.emBi
      .createQueryBuilder(ClientEntity, 'client')
      .andWhere('client.created >= :sqlFromDate', { sqlFromDate })
      .andWhere('client.created <= :sqlToDate', { sqlToDate })
      .limit(pageSize)
      .offset(pageIndex);

    const total = await queryBuilder.getCount();
    const items = await queryBuilder.getMany();
    return {
      pageIndex,
      pageSize,
      total,
      items,
    };
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
