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
  
    @Column()
    car_model: number;
  
    @Column()
    hsn: number;
  
    @Column('float')
    gst: number;
  
    @Column('float')
    rate: number;
  
    @Column()
    maintain_stock: number;
  
    @Column()
    stock_control: number;
  
    @Column()
    Qc_stock_control: number;
  
    @Column()
    wp_stock_control: number;
  
    @Column()
    qc_requried: number;
  
    @Column()
    active: number;
  
    @OneToOne(() => Item, (item) => item.details)
    @JoinColumn({ name: 'items_id' })
    item: Item;
  }
  