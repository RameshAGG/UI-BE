// import * as xlsx from 'xlsx';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ItemPrice } from '../entities/item-price.entity';
// import { Supplier } from '../entities/supplier.entity';
// import { Item } from '../entities/item.entity';
// import { File } from 'multer';

// export interface ItemPriceExcelRow {
//   'Effective Date': string;
//   'Company': string;
//   'Unit': number;
//   'Supplier': string;
//   'Item': string;
//   'Rate': number;
//   'Default Supplier': string;
// }

// export interface ImportResult {
//   row: ItemPriceExcelRow;
//   status: 'success' | 'error';
//   error?: string;
// }

// @Injectable()
// export class ItemPriceUploadService {
//   constructor(
//     @InjectRepository(ItemPrice)
//     private itemPriceRepo: Repository<ItemPrice>,
//     @InjectRepository(Supplier)
//     private supplierRepo: Repository<Supplier>,
//     @InjectRepository(Item)
//     private itemRepo: Repository<Item>,
//   ) { }

//   async importItemPrice(file: File) {
//     const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows: ItemPriceExcelRow[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

//     const results: ImportResult[] = [];
//     // const itemNameFromExcel = rows['Item']?.split('-')?.slice(1)?.join('-')?.trim();

//     for (const row of rows) {
//       try {
//         const supplier = await this.supplierRepo.findOne({ where: { name: row['Supplier']?.trim() } });
//         // const item = await this.itemRepo.findOne({ where: { item_name: row['Item']?.trim() } });
//         // const itemNameFromExcel = row['Item']?.split('-')?.slice(1)?.join('-')?.trim();
//         // const item = await this.itemRepo.findOne({ where: { item_name: itemNameFromExcel } });

//         // First try full match
//         let item = await this.itemRepo.findOne({ where: { item_name: row['Item']?.trim() } });

//         // Fallback: match on item name only (if pattern contains `-`)
//         if (!item && row['Item']?.includes('-')) {
//           const fallbackItemName = row['Item']?.split('-')?.slice(1)?.join('-')?.trim();
//           item = await this.itemRepo.findOne({ where: { item_name: fallbackItemName } });
//         }

//         if (!supplier || !item) {
//           console.warn(`Item not found for: "${row['Item']?.trim()}" or fallback: "${item?.item_name}"`);
//           results.push({
//             row,
//             status: 'error',
//             error: `Missing ${!supplier ? 'supplier' : ''}${!supplier && !item ? ' and ' : ''}${!item ? 'item' : ''}`,
//           });
//           continue;
//         }
        

//         // if (!supplier || !item) {
//         //   results.push({
//         //     row,
//         //     status: 'error',
//         //     error: `Missing ${!supplier ? 'supplier' : ''}${!supplier && !item ? ' and ' : ''}${!item ? 'item' : ''}`,
//         //   });
//         //   continue;
//         // }

//         const itemPrice = new ItemPrice();
//         itemPrice.effective_date = new Date(row['Effective Date']);
//         itemPrice.company = row['Company']?.trim();
//         itemPrice.unit = parseInt(row['Unit']?.toString()) || 0;
//         itemPrice.rate = parseFloat(row['Rate']?.toString()) || 0;
//         itemPrice.default_user = row['Default Supplier']?.trim();
//         itemPrice.supplier = supplier;
//         itemPrice.item = item;

//         await this.itemPriceRepo.save(itemPrice);
//         results.push({ row, status: 'success' });
//       } catch (error) {
//         console.error(`Error processing row:`, row, error.message);
//         results.push({ row, status: 'error', error: error.message });
//       }
//     }

//     return { summary: results };
//   }
// }

import * as xlsx from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemPrice } from '../entities/item-price.entity';
import { Supplier } from '../entities/supplier.entity';
import { Item } from '../entities/item.entity';
import { File } from 'multer';

export interface ItemPriceExcelRow {
  'Effective Date': string;
  'Company': string;
  'Unit': number | string;
  'Supplier': string;
  'Item': string;
  'Rate': number | string;
  'Default Supplier': string;
  [key: string]: any;
}

export interface ImportResult {
  row: ItemPriceExcelRow;
  status: 'success' | 'error';
  error?: string;
}

@Injectable()
export class ItemPriceUploadService {
  constructor(
    @InjectRepository(ItemPrice)
    private itemPriceRepo: Repository<ItemPrice>,

    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,

    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
  ) {}

  async importItemPrice(file: File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: ItemPriceExcelRow[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    const results: ImportResult[] = [];

    for (const row of rows) {
      const fullItemName = row['Item']?.trim();
      const fallbackItemName = fullItemName?.split('-')?.slice(1)?.join('-')?.trim() || '';

      const originalSupplierName = row['Supplier']?.trim();
      const supplierNameCleaned = originalSupplierName?.replace(/\s*-\s*S$/, '').trim();

      try {
        const supplier = await this.supplierRepo
          .createQueryBuilder('supplier')
          .where('supplier.name = :name', { name: supplierNameCleaned })
          .orWhere('supplier.name ILIKE :like', { like: `%${supplierNameCleaned}%` })
          .getOne();

        const item = await this.itemRepo
          .createQueryBuilder('item')
          .where('item.item_name = :full', { full: fullItemName })
          .orWhere('item.item_name = :fallback', { fallback: fallbackItemName })
          .orWhere('item.item_name ILIKE :like', { like: `%${fallbackItemName}%` })
          .getOne();

        if (!supplier || !item) {
          console.warn(`❌ Missing entities for row:
          → Supplier: "${originalSupplierName}" ${supplier ? '✅' : '❌ NOT FOUND'}
          → Item: "${fullItemName}" or fallback "${fallbackItemName}" ${item ? '✅' : '❌ NOT FOUND'}`);
          results.push({
            row,
            status: 'error',
            error: `Missing ${!supplier ? 'supplier' : ''}${!supplier && !item ? ' and ' : ''}${!item ? 'item' : ''}`,
          });
          continue;
        }

        const itemPrice = new ItemPrice();
        itemPrice.effective_date = this.convertExcelDate(row['Effective Date']);
        itemPrice.company = row['Company']?.trim();
        itemPrice.unit = row['Unit']?.toString() || '';
        itemPrice.rate = parseFloat(row['Rate']?.toString()) || 0;
        itemPrice.default_user = row['Default Supplier']?.trim();
        itemPrice.supplier = supplier;
        itemPrice.item = item;

        await this.itemPriceRepo.save(itemPrice);

        results.push({ row, status: 'success' });
      } catch (error) {
        console.error(`❌ Error processing row:`, row, error.message);
        results.push({ row, status: 'error', error: error.message });
      }
    }

    return { summary: results };
  }

  
  private convertExcelDate(excelDate: string | number): Date {
    if (typeof excelDate === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
      return new Date(excelEpoch.getTime() + excelDate * 86400000);
    }
    return new Date(excelDate);
  }
}
