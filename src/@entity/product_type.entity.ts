import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReceiveEntity } from './receive.entity';

@Entity()
export class ProductTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'varchar', length: 20, nullable: false })
  sku: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @OneToMany((type) => ReceiveEntity, (receive) => receive.product_type)
  receives: ReceiveEntity[];
}
