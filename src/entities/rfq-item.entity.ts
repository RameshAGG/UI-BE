import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RfqItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column()
  uom: string;

  @Column('decimal')
  quantity: number;

  @Column('decimal')
  unitPrice: number;

  @Column({ nullable: true })
  discount: string;

  @Column({ nullable: true })
  gst: string;

  @Column({ nullable: true })
  sgst: string;

  @Column({ nullable: true })
  cgst: string;

  @Column({ nullable: true })
  totalValue: string;

  @Column({ nullable: true })
  deliveryDate: string;

  @Column({ nullable: true })
  remarks: string;

  @Column()
  supplier_id: number;

  @Column()
  requestId: number;
}