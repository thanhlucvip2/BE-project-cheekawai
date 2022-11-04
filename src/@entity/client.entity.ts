import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'varchar', length: 20, nullable: false })
  client_code: string;

  @Column({ type: 'text', nullable: false })
  client_name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'text', nullable: false })
  number_phone: string;

  @Column({ type: 'text', nullable: false })
  social_network: string;

  @Column({ type: 'text', nullable: true })
  note: string;
}
