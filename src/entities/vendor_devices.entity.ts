import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('vendor_devices')
export class VendorDevices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendor_id: number;

  @Column()
  device_type: string;

  @Column()
  device_id: string;

  @Column()
  device_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;
}
