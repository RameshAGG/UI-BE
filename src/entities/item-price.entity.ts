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

@Entity('items_price_master')
export class ItemPrice {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    company: string;

    

    @Column({ type: 'varchar', length: 50 })
    unit: string;

    @Column({ type: 'date' })
    effective_date: Date;

    @Column({ type: 'numeric', precision: 10, scale: 2 }) // or 'float' if preferred
    rate: number;
    

    @Column({ length: 45 })
    default_user: string;

    @ManyToOne(() => Supplier, { nullable: true }) // or false if required
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @ManyToOne(() => Item, { nullable: true }) // or false if required
    @JoinColumn({ name: 'items_id' })
    item: Item;

}
