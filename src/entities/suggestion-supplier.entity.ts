// supplier.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { SupplierDetails } from './supplier-details.entity';
  import { Item } from './item.entity';
//   import { Organisation } from './organisation.entity'; // if you have it
  
  @Entity('SuggestionSupplier')
  export class SuggestionSupplier {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 45 })
    name: string;
  
    @Column({ length: 45 })
    email: string;
  
    @Column({ name: 'mob_num', type: 'bigint' })
    mob_num: number;
    
    @Column({ name: 'tel_num', type: 'bigint' })
    tel_num: number;
    
    @Column({ length: 50, nullable: true })
    code: string;
  
    @OneToOne(() => SupplierDetails, (details) => details.supplier, {
      cascade: true,
    })
    details: SupplierDetails;
  
  }
  