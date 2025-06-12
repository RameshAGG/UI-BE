import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuggestionSupplierService } from './suggestion-supplier.service';
import { SuggestionSupplierController } from './suggestion-supplier.controller';
import { SuggestionSupplier } from 'src/entities/suggestion-supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuggestionSupplier])],
  providers: [SuggestionSupplierService],
  controllers: [SuggestionSupplierController],
})
export class SuggestionSupplierModule {}
