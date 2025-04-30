// customer_documents.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_documents')
export class CustomerDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: number;

  @Column('text')
  TFN: string;

  @Column('text')
  license: string;

  @Column('text')
  proof_of_age: string;

  @Column('text')
  passport: string;

  @Column({ nullable: true })
  file_path: string;

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

  @OneToOne(() => Customer, (customer) => customer.documents)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
  
}

    