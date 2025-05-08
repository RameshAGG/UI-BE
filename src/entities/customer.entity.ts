import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CustomerDetails } from './customer_details.entity';
import { CustomerDocuments } from './customer_documents.entity';
import { CustomerDevices } from './customer_devices.entity';
import { CustomerRequests } from './customer_requests.entity';
import { Assignment } from './assignment.entity';

@Entity('customers')
export class Customer {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;

  @OneToOne(() => CustomerDetails, (details) => details.customer)
  details: CustomerDetails;

  @OneToOne(() => CustomerDocuments, (docs) => docs.customer, { cascade: true })
  documents: CustomerDocuments;

  @OneToMany(() => CustomerDevices, (device) => device.customer, { cascade: true })
  devices: CustomerDevices[];

  @OneToMany(() => CustomerRequests, (req) => req.customer, { cascade: true })
  requests: CustomerRequests[];

  @OneToMany(() => Assignment, (assignment) => assignment.customer)
  assignments: Assignment[];
}


