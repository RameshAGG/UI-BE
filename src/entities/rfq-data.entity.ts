import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseRequest } from './purchase-requests.entity';

@Entity()
export class RfqData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseRequest)
  @JoinColumn({ name: 'purchase_request_id' })
  purchaseRequest: PurchaseRequest;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'jsonb' })
  items: any[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date; // <-- Soft delete column
}

