import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPriceUploadController } from './item-price-upload.controller';
import { ItemPriceUploadService } from './item-price-upload.service';
import { ItemPrice } from '../entities/item-price.entity';
import { Item } from '../entities/item.entity';
import { Supplier } from '../entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemPrice, Item, Supplier])
  ],
  controllers: [ItemPriceUploadController],
  providers: [ItemPriceUploadService]
})
export class ItemPriceUploadModule {} 