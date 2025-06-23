import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemUploadService } from './item_upload.service';
import { ItemExcelRow } from './item_upload.service';

@Controller('item-upload')
export class ItemUploadController {

    constructor(private readonly itemUploadService: ItemUploadService) { }

    @Post('item-upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadItems(@UploadedFile() file: File): Promise<{ summary: Array<{ row: ItemExcelRow; status: string; error?: string }> }> {
        return this.itemUploadService.importItems(file);
    }

}
