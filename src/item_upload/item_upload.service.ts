// 



import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { ItemDetails } from '../entities/item-details.entity';
import { ItemGroup } from '../entities/item-group.entity';
import { ItemSubGroup } from '../entities/item-sub-group.entity';
import * as xlsx from 'xlsx';
import { File } from 'multer';

export interface ItemExcelRow {
  'ITEM CODE': string;
  'ITEM NAME': string;
  'ITEM GROUP': string;
  'ITEM SUB GROUP': string;
  'UOM': string;
  'PACK SIZE': string;
  'ERP CODE': string;
  'ITEM GRADE': string;
  'ITEM COLOUR': string;
  'CAR MODEL': string;
  'HSN CODE': string;
  'GST RATE': string;
  'MAINTAIN STOCK': string;
  'QC REQUIRED': string;
  'ACTIVE': string;
  'STOCK CONTROL': string;
  'WIP STOCK CONTROL': string;
  'QC STOCK CONTROL': string;
}

@Injectable()
export class ItemUploadService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
    @InjectRepository(ItemDetails)
    private itemDetailsRepo: Repository<ItemDetails>,
    @InjectRepository(ItemGroup)
    private itemGroupRepo: Repository<ItemGroup>,
    @InjectRepository(ItemSubGroup)
    private itemSubGroupRepo: Repository<ItemSubGroup>
  ) {}

  async importItems(file: File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: ItemExcelRow[] = xlsx.utils.sheet_to_json(sheet, { range: 4 });

    const results: Array<{ row: ItemExcelRow; status: string; error?: string }> = [];

    const uomMap: Record<string, number> = {
      KGS: 1,
      NOS: 2,
      PCS: 3,
      BOX: 4,
      SET: 5,
    };

    for (const row of rows) {
      try {
        // 1. Validate required fields
        if (!row['ITEM CODE']?.trim() || !row['ITEM NAME']?.trim()) {
          results.push({ row, status: 'error', error: 'Missing ITEM CODE or ITEM NAME' });
          continue;
        }

        // 2. Get or create item group
        let itemGroup = await this.itemGroupRepo.findOne({
          where: { item_group_name: row['ITEM GROUP']?.trim() },
        });

        if (!itemGroup) {
          itemGroup = new ItemGroup();
          itemGroup.item_group_name = row['ITEM GROUP']?.trim();
          itemGroup = await this.itemGroupRepo.save(itemGroup);
        }

        // 3. Get or create item sub group
        let itemSubGroup = await this.itemSubGroupRepo.findOne({
          where: { item_subgroup_name: row['ITEM SUB GROUP']?.trim() },
        });

        if (!itemSubGroup) {
          itemSubGroup = new ItemSubGroup();
          itemSubGroup.item_subgroup_name = row['ITEM SUB GROUP']?.trim() || 'DEFAULT';
          itemSubGroup.itemGroup = itemGroup;
          itemSubGroup = await this.itemSubGroupRepo.save(itemSubGroup);
        }

        // 4. Create Item
        const item = new Item();
        item.item_code = row['ITEM CODE']?.trim() || '';
        item.item_name = row['ITEM NAME']?.trim() || '';
        // item.uom = uomMap[row['UOM']?.trim()?.toUpperCase()] || 1;
        item.uom = row['UOM']?.trim()?.toUpperCase() || 'KGS'; // default fallback
        item.pack_size = this.toInt(row['PACK SIZE']);
        item.erp_code = row['ERP CODE']?.trim() || '';
        item.item_group_id = itemGroup.id;
        item.item_subgroup_id = itemSubGroup.id;
        item.itemGroup = itemGroup;
        item.itemSubGroup = itemSubGroup;

        // 5. Create ItemDetails
        const details = new ItemDetails();
        details.item_grade = this.toInt(row['ITEM GRADE']);
        details.item_colour = row['ITEM COLOUR']?.trim() || '';
        details.car_model = row['CAR MODEL']?.trim() || '';
        details.hsn = this.toInt(row['HSN CODE']);
        details.gst = this.toFloat(row['GST RATE']);
        details.rate = 0;
        details.maintain_stock = this.yesNoToBinary(row['MAINTAIN STOCK']);
        details.qc_requried = this.yesNoToBinary(row['QC REQUIRED']);
        details.active = this.yesNoToBinary(row['ACTIVE']);
        details.stock_control = this.yesNoToBinary(row['STOCK CONTROL']);
        details.wp_stock_control = this.yesNoToBinary(row['WIP STOCK CONTROL']);
        details.Qc_stock_control = this.yesNoToBinary(row['QC STOCK CONTROL']);

        // 6. Save item and item details
        const savedItem = await this.itemRepo.save(item);
        details.item = savedItem;
        await this.itemDetailsRepo.save(details);

        results.push({ row, status: 'success' });
      } catch (error) {
        console.error('Error processing row:', row, error.message);
        results.push({ row, status: 'error', error: error.message });
      }
    }

    return { summary: results };
  }

  private yesNoToBinary(value: string): number {
    return value?.trim().toLowerCase() === 'yes' ? 1 : 0;
  }

  private toInt(value: string): number {
    const cleaned = value?.toString().replace(/\D/g, '') || '';
    const num = parseInt(cleaned);
    return isNaN(num) ? 0 : num;
  }

  private toFloat(value: string): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }
}
