import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_details')
export class CustomerDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column('text')
  address: string;

  @Column()
  TFN_number: string;

  @Column()
  license: string;

  @Column()
  proof_of_age: string;

  @Column()
  passport: string;

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

  @OneToOne(() => Customer, (customer) => customer.details)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}


