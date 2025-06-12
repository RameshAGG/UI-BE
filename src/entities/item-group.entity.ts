// item-group.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Item } from './item.entity';
  
  @Entity('item_group')
  export class ItemGroup {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 45 })
    item_group_name: string;
  
  }
  