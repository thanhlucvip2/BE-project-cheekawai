import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceiveHistoryEntity } from './receive-history.entity';
import { ReceiveHistoryDto } from './receive-history.dto';

@Injectable()
export class ReceiveHistoryService {
  constructor(
    @InjectRepository(ReceiveHistoryEntity)
    private readonly receiveHistoryRepository: Repository<ReceiveHistoryEntity>,
  ) {}

  async getAllReceiveHistory() {
    return await this.receiveHistoryRepository.find({
      relations: ['product_type', 'supplier'],
    });
  }

  async getOneReceiveHistory(id: string) {
    return await this.receiveHistoryRepository.findOne({
      where: { id },
      relations: ['product_type', 'supplier'],
    });
  }
}
