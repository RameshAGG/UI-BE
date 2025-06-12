// item-sub-group.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Item } from './item.entity';
  import { ItemGroup } from './item-group.entity';
  
  @Entity('item_sub_group')
  export class ItemSubGroup {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 45 })
    item_subgroup_name: string;
  
  
    @ManyToOne(() => ItemGroup)
    @JoinColumn({ name: 'item_group_id' })
    itemGroup: ItemGroup;
  }
  