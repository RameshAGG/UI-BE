import {
    Controller, Post, UploadedFile, UseInterceptors
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ItemPriceUploadService } from './item-price-upload.service';
  import { File } from 'multer';
  import { ItemPriceExcelRow, ImportResult } from './item-price-upload.service';

  @Controller('upload')
  export class ItemPriceUploadController {
    constructor(private readonly itemPriceUploadService: ItemPriceUploadService) {}
  
    @Post('item-price')
    @UseInterceptors(FileInterceptor('file'))
    async uploadItemPrice(@UploadedFile() file: File): Promise<{ summary: ImportResult[] }> {
      return this.itemPriceUploadService.importItemPrice(file);
    }   
  }
  