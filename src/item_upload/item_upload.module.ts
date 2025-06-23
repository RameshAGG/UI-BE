import { Module } from '@nestjs/common';
import { ItemUploadService } from './item_upload.service';
import { ItemUploadController } from './item_upload.controller';
import { ItemDetails } from 'src/entities/item-details.entity';
import { ItemSubGroup } from 'src/entities/item-sub-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { ItemGroup } from 'src/entities/item-group.entity';
import { Supplier } from 'src/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemGroup, ItemSubGroup, ItemDetails, Supplier, ])],
  providers: [ItemUploadService],
  controllers: [ItemUploadController]
})
export class ItemUploadModule {}
