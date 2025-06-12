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

    @Column({ length: 45 })
    item_name: string;


    
    @Column()
    uom: number;
    
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

    @Column()
    pack_size: number;

    @Column()
    erp_code: number;

    @Column()
    item_code: number;

    @ManyToOne(() => Supplier, { nullable: true })
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @OneToOne(() => ItemDetails, (details) => details.item, { cascade: true })
    details: ItemDetails;

}
