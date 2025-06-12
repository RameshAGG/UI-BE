// supplier-details.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { Supplier } from './supplier.entity';
  
  @Entity('supplier_details')
  export class SupplierDetails {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 45 })
    address: string;
  
    @Column({ length: 45 })
    city: string;
  
    @Column({ length: 45 })
    state: string;
  
    @Column({ length: 45 })
    country: string;
  
    @Column()
    pin: number;
  
    @Column({ name: 'pan_number', type: 'bigint' })
    panNumber: number;
    
    @Column({ name: 'gst_num', type: 'bigint' })
    gstNum: number;
    
  
    @Column({ name: 'sup_code' })
    supCode: string;
  
    @OneToOne(() => Supplier, (supplier) => supplier.details)
    @JoinColumn({ name: 'supplier_id' }) // this is the FK column
    supplier: Supplier;
  }
  