import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { SubServiceMaster } from './sub_service_master.entity';

@Entity('service_master')
export class ServiceMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @DeleteDateColumn({ nullable: true })
  deletedat?: Date;

  @Column({ nullable: true })
  deletedby?: string;

  @OneToMany(() => SubServiceMaster, subServiceMaster => subServiceMaster.serviceMaster)
  subServices: SubServiceMaster[];
}
