import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SupplierEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'varchar', length: 20, nullable: false })
  supplier_code: string;

  @Column({ type: 'text', nullable: false })
  supplier_name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'text', nullable: false })
  number_phone: string;

  @Column({ type: 'text', nullable: true })
  note: string;
}
