import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from 'src/entities/supplier.entity';
import { SupplierDetails } from 'src/entities/supplier-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, SupplierDetails])],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
