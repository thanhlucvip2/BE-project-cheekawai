import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductTypeEntity } from '../product_type/product_type.entity';
import { SupplierEntity } from '../supplier/supplier.entity';

@Entity()
export class ReceiveEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  quantity_received: number;

  @Column({ type: 'float', nullable: false })
  transport_fee: number;

  @Column({ type: 'text', nullable: true })
  size: string;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ type: 'text', nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  sku: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  supplier_code: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(
    (type) => ProductTypeEntity,
    (product_type) => product_type.receives,
  )
  product_type: ProductTypeEntity;

  @ManyToOne((type) => SupplierEntity, (supplier) => supplier.receives)
  supplier: SupplierEntity;
}
