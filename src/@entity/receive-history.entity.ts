import { Entity, CreateDateColumn } from 'typeorm';
import { ReceiveEntity } from './receive.entity';

@Entity()
export class ReceiveHistoryEntity extends ReceiveEntity {
  @CreateDateColumn()
  receive_history_date: Date;
}
