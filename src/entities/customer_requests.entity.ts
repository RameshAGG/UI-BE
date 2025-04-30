// customer_requests.entity.ts
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
import { ServiceMaster } from './service_master.entity';
import { SubServiceMaster } from './sub_service_master.entity';

  @Entity('customer_requests')
  export class CustomerRequests {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    customer_id: number;
  
    @Column()
    vendor_id: number;
  
    @Column()
    service_id: number;
  
    @Column()
    sub_service_id: number;
  
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

    @ManyToOne(() => Customer, (customer) => customer.requests)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => ServiceMaster)
    @JoinColumn({ name: 'service_id' })
    service: ServiceMaster;

    @ManyToOne(() => SubServiceMaster)
    @JoinColumn({ name: 'sub_service_id' })
    subService: SubServiceMaster;

  }