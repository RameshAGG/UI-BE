// item.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { ItemDetails } from './item-details.entity';
import { ItemGroup } from './item-group.entity';
import { ItemSubGroup } from './item-sub-group.entity';
// import { PurchaseRequest } from './purchase-request.entity';


@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'item_name', length: 500 })
    item_name: string;

    @Column({ type: 'varchar', length: 50 })
    uom: string;    

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column()
    item_group_id: number;

    @Column()
    item_subgroup_id: number;

    @ManyToOne(() => ItemGroup)
    @JoinColumn({ name: 'item_group_id' })
    itemGroup: ItemGroup;

    @ManyToOne(() => ItemSubGroup)
    @JoinColumn({ name: 'item_subgroup_id' })
    itemSubGroup: ItemSubGroup;

    @Column({ type: 'int', nullable: true })
    pack_size: number;

    @Column({ type: 'varchar', length: 50 })
    item_code: string;

    @Column({ type: 'varchar', length: 50 })
    erp_code: string;


    @ManyToOne(() => Supplier, { nullable: true })
    @JoinColumn({ name: 'id' })
    supplier: Supplier;


    @OneToOne(() => ItemDetails, (details) => details.item, { cascade: true })
    details: ItemDetails;

}
