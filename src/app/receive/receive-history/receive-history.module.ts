import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiveHistoryController } from './receive-history.controller';
import { ReceiveHistoryEntity } from './receive-history.entity';
import { ReceiveHistoryService } from './receive-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiveHistoryEntity])],
  controllers: [ReceiveHistoryController],
  providers: [ReceiveHistoryService],
})
export class ReceiveHistoryModule {}
