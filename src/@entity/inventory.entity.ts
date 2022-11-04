import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductTypeEntity } from './product_type.entity';
import { SupplierEntity } from './supplier.entity';

@Entity()
export class InventoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  size: string;

  @Column({ type: 'text', nullable: true })
  color: string;

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
