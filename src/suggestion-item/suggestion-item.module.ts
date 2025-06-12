import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuggestionItem } from '../entities/suggestion.item.entity';
import { SuggestionItemController } from './suggestion-item.controller';
import { SuggestionItemService } from './suggestion-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([SuggestionItem])],
  controllers: [SuggestionItemController],
  providers: [SuggestionItemService],
  exports: [SuggestionItemService]
})
export class SuggestionItemModule {}
