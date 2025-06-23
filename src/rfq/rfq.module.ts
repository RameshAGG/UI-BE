// src/rfq/rfq.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrDetails } from '../entities/pr-details.entity';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { RfqData } from 'src/entities/rfq-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrDetails,RfqData])],
  providers: [RfqService],
  controllers: [RfqController],
})
export class RfqModule {}