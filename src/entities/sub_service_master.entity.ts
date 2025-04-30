import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ServiceMaster } from './service_master.entity';

@Entity('sub_service_master')
export class SubServiceMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service_id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'created_by', nullable: true })
  created_by: string;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'deletedBy', nullable: true })
  deletedBy?: string;

  @ManyToOne(() => ServiceMaster, serviceMaster => serviceMaster.subServices)
  @JoinColumn({ name: 'service_id' })
  serviceMaster: ServiceMaster;
}
