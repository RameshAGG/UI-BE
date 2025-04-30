import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('vendor_documents')
export class VendorDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendor_id: number;

  @Column('text')
  TFN: string;

  @Column('text')
  license: string;

  @Column('text')
  proof_of_age: string;

  @Column('text')
  passport: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;
}
