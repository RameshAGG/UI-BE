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
  
    @Column({ length: 255})
    address: string;
  
    @Column({ length: 100 })
    city: string;
  
    @Column({ length: 100 })
    state: string;
  
    @Column({ length: 100 })
    country: string;
  
    @Column()
    pin: number;
  
    @Column({ name: 'pan_number', type: 'bigint' })
    panNumber: number;
    
    @Column({ name: 'gst_num', type: 'bigint' })
    gstNum: number;
    
  
    @Column({ name: 'sup_code', length: 100 })
    supCode: string;
  
    @OneToOne(() => Supplier, (supplier) => supplier.details)
    @JoinColumn({ name: 'supplier_id' }) // this is the FK column
    supplier: Supplier;
  }
  