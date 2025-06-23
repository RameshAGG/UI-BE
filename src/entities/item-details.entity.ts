// item-details.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { Item } from './item.entity';
  
  @Entity('item_details')
  export class ItemDetails {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    item_grade: number;
  
    @Column({ length: 45 })
    item_colour: string;
  
    @Column({ type: 'varchar', length: 50, nullable: true })
    car_model: string;
    
    @Column({ type: 'float', nullable: true })
    hsn: number;
  
    @Column({ type: 'float', nullable: true })
    gst: number;
  
    @Column({ type: 'float', default: 0 })
    rate: number;
  
    @Column({ type: 'int', default: 0 })
    maintain_stock: number;
  
    @Column({ type: 'int', default: 0 })
    stock_control: number;
  
    @Column({ type: 'int', default: 0 })
    Qc_stock_control: number;
  
    @Column({ type: 'int', default: 0 })
    wp_stock_control: number;
  
    @Column({ type: 'int', default: 0 })
    qc_requried: number;
  
    @Column({ type: 'int', default: 0 })
    active: number;
  
    @OneToOne(() => Item, (item) => item.details)
    @JoinColumn({ name: 'items_id' })
    item: Item;
  }
  