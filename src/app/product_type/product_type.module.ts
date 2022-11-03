import { Module } from '@nestjs/common';
import { ProductTypeController } from './product_type.controller';
import { ProductTypeService } from './product_type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from './product_type.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule {}
