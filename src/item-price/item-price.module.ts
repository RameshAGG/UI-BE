// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ItemPrice } from 'src/entities/item-price.entity';
// import { ItemPriceService } from './item-price.service';
// import { ItemPriceController } from './item-price.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([ItemPrice])],
//   providers: [ItemPriceService],
//   controllers: [ItemPriceController],
// })
// export class ItemPriceModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPrice } from 'src/entities/item-price.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Item } from 'src/entities/item.entity';
import { ItemPriceService } from './item-price.service';
import { ItemPriceController } from './item-price.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemPrice, Supplier, Item]) // ✅ include all required repositories
  ],
  controllers: [ItemPriceController],
  providers: [ItemPriceService],
})
export class ItemPriceModule {}
