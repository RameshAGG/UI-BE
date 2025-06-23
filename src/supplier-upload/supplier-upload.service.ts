import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { SupplierDetails } from '../entities/supplier-details.entity';
import * as xlsx from 'xlsx';
import { File } from 'multer';

export interface SupplierExcelRow {
  TYPE?: string;
  CODE?: string;
  NAME?: string;
  ADDRESS?: string;
  CITY?: string;
  STATE?: string;
  COUNTRY?: string;
  PIN?: string | number;
  EMAIL?: string;
  'TEL.NO'?: string | number;
  'MOB.NO'?: string | number;
  'PAN NO'?: string;
  'GST NO'?: string;
}

@Injectable()
export class SupplierUploadService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,
    @InjectRepository(SupplierDetails)
    private supplierDetailsRepo: Repository<SupplierDetails>,
  ) {}

  async importSuppliers(file: File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json<SupplierExcelRow>(sheet, { range: 4 });

    const results: Array<{ row: SupplierExcelRow; status: string; error?: string }> = [];

    for (const row of rows) {
      try {
        // Basic validations
        if (!row.NAME) {
          throw new Error(`Required fields missing (NAME or EMAIL)`);
        }

        const supplier = new Supplier();
        supplier.name = row.NAME.trim();
        // supplier.email = row.EMAIL.includes(';') ? row.EMAIL.split(';')[0].trim() : row.EMAIL.trim();
        supplier.email = row.EMAIL?.trim() || '';
        supplier.mob_num = isNaN(+(row['MOB.NO'] ?? 0)) ? 0 : +(row['MOB.NO'] ?? 0);
        supplier.tel_num = isNaN(+(row['TEL.NO'] ?? 0)) ? 0 : +(row['TEL.NO'] ?? 0);

        const savedSupplier = await this.supplierRepo.save(supplier);

        const details = new SupplierDetails();
        details.address = row.ADDRESS?.trim() || '';
        details.city = row.CITY?.trim() || '';
        details.state = row.STATE?.trim() || '';
        details.country = row.COUNTRY?.trim() || '';
        details.pin = isNaN(+(row.PIN ?? 0)) ? 0 : +(row.PIN ?? 0);
        details.panNumber = row['PAN NO'] && !isNaN(+row['PAN NO']) ? +row['PAN NO'] : 0;
        details.gstNum = row['GST NO'] && !isNaN(+row['GST NO']) ? +row['GST NO'] : 0;
        details.supCode = row.CODE?.trim() || '';
        details.supplier = savedSupplier;

        await this.supplierDetailsRepo.save(details);

        results.push({ row, status: 'success' });
      } catch (error) {
        results.push({
          row,
          status: 'error',
          error: error.message || 'Unknown error',
        });
      }
    }

    return { summary: results };
  }
}
