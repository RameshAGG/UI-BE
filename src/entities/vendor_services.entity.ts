import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { ServiceMaster } from './service_master.entity';
import { SubServiceMaster } from './sub_service_master.entity';

@Entity('vendor_services')
export class VendorServices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendor_id: number;

  @Column()
  service_id: number;

  @Column()
  sub_service_id: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;

  @ManyToOne(() => ServiceMaster)
  @JoinColumn({ name: 'service_id' })
  service: ServiceMaster;

  @ManyToOne(() => SubServiceMaster)
  @JoinColumn({ name: 'sub_service_id' })
  subService: SubServiceMaster;

  @ManyToOne(() => Vendor, (vendor) => vendor.vendorServices)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;
  created_at: any;
}


