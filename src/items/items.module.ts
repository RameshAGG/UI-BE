import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { ItemDetails } from 'src/entities/item-details.entity';
// import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemsController, } from './items.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemDetails])],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService], // <-- export if used in another module
})
export class ItemsModule {}
