// supplier-upload.module.ts OR supplier.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { SupplierDetails } from '../entities/supplier-details.entity';
import { SupplierUploadService } from './supplier-upload.service';
import { SupplierUploadController } from './supplier-upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, SupplierDetails]), // 👈 important!
  ],
  providers: [SupplierUploadService],
  controllers: [SupplierUploadController],
})
export class SupplierUploadModule {}
