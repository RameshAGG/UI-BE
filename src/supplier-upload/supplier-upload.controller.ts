// supplier-upload.controller.ts

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupplierUploadService } from './supplier-upload.service';

@Controller('supplier-upload')
export class SupplierUploadController {
  constructor(private readonly supplierUploadService: SupplierUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: File) {
    return this.supplierUploadService.importSuppliers(file);
  }
}
