import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;
} 