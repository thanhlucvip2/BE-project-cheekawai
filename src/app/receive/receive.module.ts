import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from '../product_type/product_type.entity';
import { SupplierEntity } from '../supplier/supplier.entity';
import { ReceiveController } from './receive.controller';
import { ReceiveEntity } from './receive.entity';
import { ReceiveService } from './receive.service';
import { ReceiveHistoryModule } from './receive-history/receive-history.module';
import { ReceiveHistoryEntity } from './receive-history/receive-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReceiveEntity,
      ProductTypeEntity,
      SupplierEntity,
      ReceiveHistoryEntity,
    ]),
    ReceiveHistoryModule,
  ],
  controllers: [ReceiveController],
  providers: [ReceiveService],
})
export class ReceiveModule {}
