import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequestController } from './purchase-request.controller';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequest } from '../entities/purchase-requests.entity';
import { PrDetails } from '../entities/pr-details.entity';
import { Item } from '../entities/item.entity';
import { Supplier } from '../entities/supplier.entity';
import { SuggestionItem } from '../entities/suggestion.item.entity';
import { SuggestionSupplier } from '../entities/suggestion-supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseRequest,
      PrDetails,
      Item,
      Supplier,
      SuggestionItem,
      SuggestionSupplier
    ])
  ],
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
  exports: [PurchaseRequestService]
})
export class PurchaseRequestModule {}
