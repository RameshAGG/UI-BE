// src/rfq-data/rfq-data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RfqDataService } from './rfq-data.service';
import { RfqDataController } from './rfq-data.controller';
import { RfqData } from 'src/entities/rfq-data.entity';
import { PurchaseRequest } from 'src/entities/purchase-requests.entity';
import { Supplier } from 'src/entities/supplier.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([RfqData]),
    PurchaseRequest,
    Supplier,
  ],
  controllers: [RfqDataController],
  providers: [RfqDataService],
})
export class RfqDataModule {}