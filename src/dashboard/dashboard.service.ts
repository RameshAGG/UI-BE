import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPrice } from 'src/entities/item-price.entity';
import { Item } from 'src/entities/item.entity';
import { PurchaseRequest } from 'src/entities/purchase-requests.entity';
import { SuggestionSupplier } from 'src/entities/suggestion-supplier.entity';
import { SuggestionItem } from 'src/entities/suggestion.item.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
        @InjectRepository(PurchaseRequest) private prRepo: Repository<PurchaseRequest>,
        @InjectRepository(ItemPrice) private priceRepo: Repository<ItemPrice>,
        @InjectRepository(SuggestionItem) private suggRepo: Repository<SuggestionItem>,
        @InjectRepository(SuggestionSupplier) private suggsupRepo: Repository<SuggestionSupplier>,
      ) {}
    
      async getTotals() {
        const [totalItems, totalSuppliers, totalPRs, totalPrices, totalSuggestions,totalnewSupplier] =
          await Promise.all([
            this.itemRepo.count(),
            this.supplierRepo.count(),
            this.prRepo.count(),
            this.priceRepo.count(),
            this.suggRepo.count(),
            this.suggsupRepo.count(),
          ]);
        return { totalItems, totalSuppliers, totalPRs, totalPrices, totalSuggestions,totalnewSupplier};
      }
    
}
