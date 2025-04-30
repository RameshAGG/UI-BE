import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  DeleteDateColumn
} from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('vendor_details')
export class VendorDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendor_id: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column('text')
  address: string;

  @Column()
  TFN_number: string;

  @Column()
  license: string;

  @Column()
  proof_of_age: string;

  @Column()
  passport: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;

  @OneToOne(() => Vendor, (vendor) => vendor.vendorDetails)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
}
