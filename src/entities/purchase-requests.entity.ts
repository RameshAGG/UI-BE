
import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PrDetails } from './pr-details.entity';


@Entity('purchase_requests')
export class PurchaseRequest {

  @PrimaryGeneratedColumn()
  id: number;
  // This should be OneToMany, not ManyToOne
  // @OneToMany(() => PrDetails, (prDetails) => prDetails.purchase_request)
  // pr_details: PrDetails[];

  
  @OneToMany(() => PrDetails, (prDetail) => prDetail.purchase_request)
  pr_details: PrDetails[];
}
