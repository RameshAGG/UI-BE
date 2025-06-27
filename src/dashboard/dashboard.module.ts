// import { Module } from '@nestjs/common';
// import { DashboardService } from './dashboard.service';
// import { DashboardController } from './dashboard.controller';

// @Module({

//   providers: [DashboardService],
//   controllers: [DashboardController]
// })
// export class DashboardModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPrice } from 'src/entities/item-price.entity';
import { Item } from 'src/entities/item.entity';
import { PurchaseRequest } from 'src/entities/purchase-requests.entity';
import { SuggestionItem } from 'src/entities/suggestion.item.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SuggestionSupplier } from 'src/entities/suggestion-supplier.entity';
// import { DashboardService } from './dashboard-service.service';
// import { DashboardController } from './dashboard-controller.controller';
// import { Item } from '../item.entity';
// import { Supplier } from '../supplier.entity';
// import { PurchaseRequest } from '../purchase-request.entity';
// import { ItemPrice } from '../item-price.entity';
// import { SuggestionItem } from '../suggestion-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Item,
      Supplier,
      PurchaseRequest,
      ItemPrice,
      SuggestionItem,
      SuggestionSupplier
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
