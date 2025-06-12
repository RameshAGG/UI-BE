// supplier-history.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Item } from './item.entity';
//   import { Supplier } from './supplier.entity';
//   import { Item } from './item.entity';
  
  @Entity('supplier_history')
  export class SupplierHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rate: number;
  
    @Column({ type: 'bigint' }) // assuming INT holds UNIX timestamp, or use type: 'timestamp'
    created_at: number;
  
    @Column({ length: 45 })
    created_by: string;
  
    @Column({ type: 'date' })
    valid_date: Date;
  
    @Column()
    supplier_id: number;
  
    @Column()
    items_id: number;
  
    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;
  
    @ManyToOne(() => Item)
    @JoinColumn({ name: 'items_id' })
    item: Item;
  }
  