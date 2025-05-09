import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { VendorDetails } from './vendor_details.entity';
import { VendorServices } from './vendor_services.entity';
import { Assignment } from './assignment.entity';

@Entity('vendor')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  age: number;

  @Column()
  status: string;

  @Column()
  organization_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => VendorDetails, (details) => details.vendor, { cascade: true })
  vendorDetails: VendorDetails;

  @OneToMany(() => VendorServices, (service) => service.vendor, { cascade: true })
  vendorServices: VendorServices[];

  @OneToMany(() => Assignment, (assignment) => assignment.vendor)
  assignments: Assignment[];
}

