// customer_devices.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_devices')
export class CustomerDevices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: number;

  @ManyToOne(() => Customer, (customer) => customer.devices)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  device_type: string;

  @Column()
  device_id: string;

  @Column()
  device_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;
}
