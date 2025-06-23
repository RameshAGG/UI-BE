import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Item } from './item.entity';
import { Supplier } from './supplier.entity';
import { PurchaseRequest } from './purchase-requests.entity';
import { SuggestionItem } from './suggestion.item.entity';
import { SuggestionSupplier } from './suggestion-supplier.entity';

@Entity('pr_details')
export class PrDetails {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  department: string;

  @Column({ type: 'date' })
  date_requested: Date;

  @Column({ length: 45 })
  status: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'boolean' })
  item_type: boolean;


  @ManyToOne(() => Item, { eager: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Supplier, { nullable: true }) // or false if required
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => PurchaseRequest)
  @JoinColumn({ name: 'purchase_request_id' })
  purchase_request: PurchaseRequest;

  // pr-details.entity.ts
  @ManyToOne(() => SuggestionItem, { nullable: true })
  @JoinColumn({ name: 'suggestion_item_id' })
  suggestion_item?: SuggestionItem;

  @ManyToOne(() => SuggestionSupplier, { nullable: true })
  @JoinColumn({ name: 'suggestion_supplier_id' })
  suggestion_supplier?: SuggestionSupplier;

}


