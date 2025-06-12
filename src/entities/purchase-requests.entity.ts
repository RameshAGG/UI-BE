
import {
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  
  @Entity('purchase_requests')
  export class PurchaseRequest {
   
    @PrimaryGeneratedColumn()
    id: number;
  }
  