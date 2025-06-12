// item-price.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Item } from './item.entity';
//   import { Item } from './item.entity';
//   import { Supplier } from './supplier.entity';
//   import { BaseEntity } from '../common/entities/base.entity';

@Entity('items_price_master')
export class ItemPrice {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    company: string;

    @Column()
    unit: number;

    @Column({ type: 'date' })
    effective_date: Date;

    @Column()
    rate: number;

    @Column({ length: 45 })
    default_user: string;

    // @Column()
    // supplier_id: number;

    // @Column()
    // items_id: number;

    // @ManyToOne(() => Supplier)
    // @JoinColumn({ name: 'supplier_id' })
    // supplier: Supplier;

    // @ManyToOne(() => Item)
    // @JoinColumn({ name: 'items_id' })
    // item: Item;
    @ManyToOne(() => Supplier, { nullable: true }) // or false if required
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @ManyToOne(() => Item, { nullable: true }) // or false if required
    @JoinColumn({ name: 'items_id' })
    item: Item;

}
