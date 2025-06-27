// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { PrDetails } from '../entities/pr-details.entity';
// import * as ExcelJS from 'exceljs';

// interface SupplierFile {
//   filename: string;
//   buffer: ExcelJS.Buffer;
//   supplierId: number;
//   supplierName: string;
// }

// @Injectable()
// export class RfqService {
//   constructor(
//     @InjectRepository(PrDetails)
//     private prDetailsRepository: Repository<PrDetails>,
//   ) {}

//   async generateRfqExcelsBySupplier(purchaseRequestId: number): Promise<SupplierFile[]> {
//     // Get all PR details for this request with related items and suppliers
//     const prDetails = await this.prDetailsRepository.find({
//       where: { purchase_request: { id: purchaseRequestId } },
//       relations: ['item', 'supplier', 'suggestion_item', 'suggestion_supplier'],
//     });

//     // Group data by supplier
//     const supplierData = new Map();

//     prDetails.forEach(detail => {
//       const supplier = detail.supplier || detail.suggestion_supplier;
//       if (!supplier) return;

//       const supplierId = supplier.id;
//       const supplierName = supplier.name;
//       const supplierCode = supplier.code;

//       if (!supplierData.has(supplierId)) {
//         supplierData.set(supplierId, {
//           id: supplierId,
//           name: supplierName,
//           code: supplierCode,
//           items: new Map()
//         });
//       }

//       const itemKey = detail.item.id;
//       if (!supplierData.get(supplierId).items.has(itemKey)) {
//         supplierData.get(supplierId).items.set(itemKey, {
//           itemName: detail.item.item_name,
//           itemCode: detail.item.item_code,
//           uom: detail.item.uom,
//           quantity: detail.quantity,
//         });
//       }
//     });

//     // Generate Excel file for each supplier
//     const supplierFiles: SupplierFile[] = [];

//     for (const [supplierId, supplier] of supplierData) {
//       const buffer = await this.generateExcelForSingleSupplier(
//         purchaseRequestId,
//         supplier
//       );

//       supplierFiles.push({
//         filename: `RFQ_${purchaseRequestId}_${supplier.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
//         buffer,
//         supplierId: supplier.id,
//         supplierName: supplier.name
//       });
//     }

//     return supplierFiles;
//   }

//   async generateRfqExcelForSupplier(purchaseRequestId: number, supplierId: number): Promise<ExcelJS.Buffer> {
//     // Get PR details for specific supplier
//     const prDetails = await this.prDetailsRepository.find({
//       where: { 
//         purchase_request: { id: purchaseRequestId },
//         supplier: { id: supplierId }
//       },
//       relations: ['item', 'supplier'],
//     });

//     if (prDetails.length === 0) {
//       // Try with suggestion_supplier
//       const suggestionDetails = await this.prDetailsRepository.find({
//         where: { 
//           purchase_request: { id: purchaseRequestId },
//           suggestion_supplier: { id: supplierId }
//         },
//         relations: ['item', 'suggestion_supplier'],
//       });
//       prDetails.push(...suggestionDetails);
//     }

//     const supplier = prDetails[0]?.supplier || prDetails[0]?.suggestion_supplier;
//     if (!supplier) {
//       throw new Error(`Supplier with ID ${supplierId} not found for this purchase request`);
//     }

//     // Process items for this supplier
//     const items = new Map();
//     prDetails.forEach(detail => {
//       const itemKey = detail.item.id;
//       if (!items.has(itemKey)) {
//         items.set(itemKey, {
//           itemName: detail.item.item_name,
//           itemCode: detail.item.item_code,
//           uom: detail.item.uom,
//           quantity: detail.quantity,
//         });
//       }
//     });

//     return await this.generateExcelForSingleSupplier(purchaseRequestId, {
//       id: supplier.id,
//       name: supplier.name,
//       code: supplier.code,
//       items
//     });
//   }

//   private async generateExcelForSingleSupplier(
//     purchaseRequestId: number,
//     supplier: any
//   ): Promise<ExcelJS.Buffer> {
//     // Create workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet(`RFQ - ${supplier.name}`);

//     // Add title and supplier info
//     worksheet.mergeCells('A1:H1');
//     worksheet.getCell('A1').value = `Request for Quotation - Purchase Request #${purchaseRequestId}`;
//     worksheet.getCell('A1').font = { bold: true, size: 16 };
//     worksheet.getCell('A1').alignment = { horizontal: 'center' };

//     worksheet.mergeCells('A2:H2');
//     worksheet.getCell('A2').value = `Supplier: ${supplier.name} (${supplier.code})`;
//     worksheet.getCell('A2').font = { bold: true, size: 12 };

//     // Add empty row
//     worksheet.addRow([]);

//     // Add headers
//     const headerRow = worksheet.addRow([
//       'Item Name',
//       'Item Code', 
//       'UOM',
//       'Quantity',
//       'Unit Price',
//       'Total Value',
//       'Delivery Date',
//       'Remarks'
//     ]);

//     // Style headers
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true };
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FFE0E0E0' }
//       };
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//     });

//     // Set column widths
//     worksheet.columns = [
//       { width: 30 }, // Item Name
//       { width: 15 }, // Item Code
//       { width: 10 }, // UOM
//       { width: 10 }, // Quantity
//       { width: 12 }, // Unit Price
//       { width: 15 }, // Total Value
//       { width: 15 }, // Delivery Date
//       { width: 20 }, // Remarks
//     ];

//     // Add data rows
//     supplier.items.forEach((item) => {
//       const row = worksheet.addRow([
//         item.itemName,
//         item.itemCode,
//         item.uom,
//         item.quantity,
//         '', // Unit Price - to be filled by supplier
//         { formula: `D${worksheet.rowCount}*E${worksheet.rowCount}` }, // Total Value formula
//         '', // Delivery Date - to be filled by supplier
//         '' // Remarks - to be filled by supplier
//       ]);

//       // Add borders to data rows
//       row.eachCell((cell) => {
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });
//     });

//     // Add total row
//     const totalRowNum = worksheet.rowCount + 1;
//     const totalRow = worksheet.addRow([
//       '', '', '', 'TOTAL:', '', 
//       { formula: `SUM(F5:F${worksheet.rowCount})` }, 
//       '', ''
//     ]);

//     totalRow.getCell(4).font = { bold: true };
//     totalRow.getCell(6).font = { bold: true };
//     totalRow.getCell(6).fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFFCC' }
//     };

//     // Format currency columns
//     worksheet.getColumn(5).numFmt = '#,##0.00'; // Unit Price
//     worksheet.getColumn(6).numFmt = '#,##0.00'; // Total Value

//     // Add instructions
//     worksheet.addRow([]);
//     worksheet.addRow(['Instructions:']).getCell(1).font = { bold: true };
//     worksheet.addRow(['1. Please fill in the Unit Price for each item']);
//     worksheet.addRow(['2. Specify delivery dates for each item']);
//     worksheet.addRow(['3. Add any remarks or special conditions']);
//     worksheet.addRow(['4. Return this completed form by [DATE]']);

//     return await workbook.xlsx.writeBuffer();
//   }

//   // Keep the original method for backward compatibility
//   async generateRfqExcel(purchaseRequestId: number): Promise<ExcelJS.Buffer> {
//     const supplierFiles = await this.generateRfqExcelsBySupplier(purchaseRequestId);
//     if (supplierFiles.length > 0) {
//       return supplierFiles[0].buffer; // Return first supplier's file
//     }
//     throw new Error('No suppliers found for this purchase request');
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { PrDetails } from '../entities/pr-details.entity';
// import * as ExcelJS from 'exceljs';
// import { RfqData } from 'src/entities/rfq-data.entity';
// import { RfqItem } from 'src/entities/rfq-item.entity';
// import { PurchaseRequest } from 'src/entities/purchase-requests.entity';
// import { Supplier } from 'src/entities/supplier.entity';

// interface SupplierFile {
//   filename: string;
//   buffer: ExcelJS.Buffer;
//   supplierId: number;
//   supplierName: string;
// }

// @Injectable()
// export class RfqService {
//   constructor(
//     @InjectRepository(RfqData)
//     private rfqDataRepository: Repository<RfqData>,
//     @InjectRepository(PrDetails)
//     private prDetailsRepository: Repository<PrDetails>,

//   ) {}


//   async processRfqUpload(
//     purchaseRequestId: number,
//     supplierId: number,
//     items: any[]
//   ) {
//     // Validate inputs
//     if (!purchaseRequestId || !supplierId) {
//       throw new Error('Missing required IDs');
//     }

//     if (!items?.length) {
//       throw new Error('No items provided');
//     }

//     // Process only valid items
//     const processedItems = items
//       .filter(item => 
//         item?.name && 
//         !item.name.toString().match(/item name|instruction|note:|tax calculation/i) &&
//         (item.quantity > 0 || item.unitPrice > 0)
//       )
//       .map(item => ({
//         name: item.name.toString().trim(),
//         code: item.code?.toString().trim() || '',
//         uom: item.uom?.toString().trim() || 'EA',
//         quantity: Math.max(0, Number(item.quantity) || 0),
//         unitPrice: Math.max(0, Number(item.unitPrice) || 0),
//         discount: item.discount?.toString().trim() || '0%',
//         gst: item.gst?.toString().trim() || '0%',
//         sgst: item.sgst?.toString().trim() || '0%',
//         cgst: item.cgst?.toString().trim() || '0%',
//         totalValue: item.totalValue?.toString().trim() || 
//                    (Number(item.quantity) * Number(item.unitPrice)).toFixed(2),
//         deliveryDate: item.deliveryDate?.toString().trim() || '',
//         remarks: item.remarks?.toString().trim() || ''
//       }));

//     if (processedItems.length === 0) {
//       throw new Error('No valid items after processing');
//     }

//     // Save to database
//     const rfqData = this.rfqDataRepository.create({
//       purchaseRequest: { id: purchaseRequestId },
//       supplier: { id: supplierId },
//       items: processedItems,
//       uploadedAt: new Date()
//     });

//     const savedData = await this.rfqDataRepository.save(rfqData);

//     // Return clean response without header row
//     return {
//       id: savedData.id,
//       purchaseRequest: { id: savedData.purchaseRequest.id },
//       supplier: { id: savedData.supplier.id },
//       items: savedData.items.filter(item => 
//         !item.name.match(/item name|instruction|note:|tax calculation/i)
//       ),
//       uploadedAt: savedData.uploadedAt
//     };
//   }





//   async getRfqDataForRequest(purchaseRequestId: number) {
//     return await this.rfqDataRepository.find({
//       where: { purchaseRequest: { id: purchaseRequestId } },
//       relations: ['supplier']
//     });
//   }





//   async generateRfqExcelsBySupplier(purchaseRequestId: number): Promise<SupplierFile[]> {
//     // Get all PR details for this request with related items and suppliers
//     const prDetails = await this.prDetailsRepository.find({
//       where: { purchase_request: { id: purchaseRequestId } },
//       relations: ['item', 'supplier', 'suggestion_item', 'suggestion_supplier'],
//     });

//     // Group data by supplier
//     const supplierData = new Map();

//     prDetails.forEach(detail => {
//       const supplier = detail.supplier || detail.suggestion_supplier;
//       if (!supplier) return;

//       const supplierId = supplier.id;
//       const supplierName = supplier.name;
//       const supplierCode = supplier.code;

//       if (!supplierData.has(supplierId)) {
//         supplierData.set(supplierId, {
//           id: supplierId,
//           name: supplierName,
//           code: supplierCode,
//           items: new Map()
//         });
//       }

//       const itemKey = detail.item.id;
//       if (!supplierData.get(supplierId).items.has(itemKey)) {
//         supplierData.get(supplierId).items.set(itemKey, {
//           itemName: detail.item.item_name,
//           itemCode: detail.item.item_code,
//           uom: detail.item.uom,
//           quantity: detail.quantity,
//         });
//       }
//     });

//     // Generate Excel file for each supplier
//     const supplierFiles: SupplierFile[] = [];

//     for (const [supplierId, supplier] of supplierData) {
//       const buffer = await this.generateExcelForSingleSupplier(
//         purchaseRequestId,
//         supplier
//       );

//       supplierFiles.push({
//         filename: `RFQ_${purchaseRequestId}_${supplier.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
//         buffer,
//         supplierId: supplier.id,
//         supplierName: supplier.name
//       });
//     }

//     return supplierFiles;
//   }

//   async generateRfqExcelForSupplier(purchaseRequestId: number, supplierId: number): Promise<ExcelJS.Buffer> {
//     // Get PR details for specific supplier
//     const prDetails = await this.prDetailsRepository.find({
//       where: { 
//         purchase_request: { id: purchaseRequestId },
//         supplier: { id: supplierId }
//       },
//       relations: ['item', 'supplier'],
//     });

//     if (prDetails.length === 0) {
//       // Try with suggestion_supplier
//       const suggestionDetails = await this.prDetailsRepository.find({
//         where: { 
//           purchase_request: { id: purchaseRequestId },
//           suggestion_supplier: { id: supplierId }
//         },
//         relations: ['item', 'suggestion_supplier'],
//       });
//       prDetails.push(...suggestionDetails);
//     }

//     const supplier = prDetails[0]?.supplier || prDetails[0]?.suggestion_supplier;
//     if (!supplier) {
//       throw new Error(`Supplier with ID ${supplierId} not found for this purchase request`);
//     }

//     // Process items for this supplier
//     const items = new Map();
//     prDetails.forEach(detail => {
//       const itemKey = detail.item.id;
//       if (!items.has(itemKey)) {
//         items.set(itemKey, {
//           itemName: detail.item.item_name,
//           itemCode: detail.item.item_code,
//           uom: detail.item.uom,
//           quantity: detail.quantity,
//         });
//       }
//     });

//     return await this.generateExcelForSingleSupplier(purchaseRequestId, {
//       id: supplier.id,
//       name: supplier.name,
//       code: supplier.code,
//       items
//     });
//   }

//   private async generateExcelForSingleSupplier(
//     purchaseRequestId: number,
//     supplier: any
//   ): Promise<ExcelJS.Buffer> {
//     // Create workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet(`RFQ - ${supplier.name}`);

//     // Add title and supplier info
//     worksheet.mergeCells('A1:L1'); // Extended to column L for new headers
//     worksheet.getCell('A1').value = `Request for Quotation - Purchase Request #${purchaseRequestId}`;
//     worksheet.getCell('A1').font = { bold: true, size: 16 };
//     worksheet.getCell('A1').alignment = { horizontal: 'center' };

//     worksheet.mergeCells('A2:L2'); // Extended to column L for new headers
//     worksheet.getCell('A2').value = `Supplier: ${supplier.name} (${supplier.code})`;
//     worksheet.getCell('A2').font = { bold: true, size: 12 };

//     // Add empty row
//     worksheet.addRow([]);

//     // Add headers with new tax columns
//     const headerRow = worksheet.addRow([
//       'Item Name',
//       'Item Code', 
//       'UOM',
//       'Quantity',
//       'Unit Price',
//       'Discount (%)',
//       'GST (%)',
//       'SGST (%)',
//       'CGST (%)',
//       'Total Value',
//       'Delivery Date',
//       'Remarks'
//     ]);

//     // Style headers
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true };
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FFE0E0E0' }
//       };
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//     });

//     // Set column widths
//     worksheet.columns = [
//       { width: 30 }, // Item Name
//       { width: 15 }, // Item Code
//       { width: 10 }, // UOM
//       { width: 10 }, // Quantity
//       { width: 12 }, // Unit Price
//       { width: 12 }, // Discount (%)
//       { width: 10 }, // GST (%)
//       { width: 10 }, // SGST (%)
//       { width: 10 }, // CGST (%)
//       { width: 15 }, // Total Value
//       { width: 15 }, // Delivery Date
//       { width: 20 }, // Remarks
//     ];

//     // Add data rows
//     supplier.items.forEach((item) => {
//       const currentRow = worksheet.rowCount + 1;
//       const row = worksheet.addRow([
//         item.itemName,
//         item.itemCode,
//         item.uom,
//         item.quantity,
//         '', // Unit Price - to be filled by supplier
//         '', // Discount (%) - to be filled by supplier
//         '', // GST (%) - to be filled by supplier
//         '', // SGST (%) - to be filled by supplier
//         '', // CGST (%) - to be filled by supplier
//         { 
//           // Total Value formula: (Quantity * Unit Price) - Discount + GST + SGST + CGST
//           // Formula: ((D*E) * (1 - F/100)) * (1 + (G+H+I)/100)
//           formula: `((D${currentRow}*E${currentRow})*(1-F${currentRow}/100))*(1+(G${currentRow}+H${currentRow}+I${currentRow})/100)`
//         },
//         '', // Delivery Date - to be filled by supplier
//         '' // Remarks - to be filled by supplier
//       ]);

//       // Add borders to data rows
//       row.eachCell((cell) => {
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });
//     });

//     // Add subtotal, tax, and total rows
//     const subtotalRowNum = worksheet.rowCount + 1;
//     const subtotalRow = worksheet.addRow([
//       '', '', '', 'SUBTOTAL:', '', '', '', '', '', 
//       { formula: `SUM(J5:J${worksheet.rowCount})` }, 
//       '', ''
//     ]);

//     subtotalRow.getCell(4).font = { bold: true };
//     subtotalRow.getCell(10).font = { bold: true };
//     subtotalRow.getCell(10).fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFF0F0F0' }
//     };

//     // Add total tax row
//     const taxRowNum = worksheet.rowCount + 1;
//     const taxRow = worksheet.addRow([
//       '', '', '', 'TOTAL TAX:', '', '', '', '', '',
//       { formula: `J${subtotalRowNum}-SUM(D5:D${subtotalRowNum-1}*E5:E${subtotalRowNum-1}*(1-F5:F${subtotalRowNum-1}/100))` },
//       '', ''
//     ]);

//     taxRow.getCell(4).font = { bold: true };
//     taxRow.getCell(10).font = { bold: true };
//     taxRow.getCell(10).fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFFEB' }
//     };

//     // Add grand total row
//     const grandTotalRow = worksheet.addRow([
//       '', '', '', 'GRAND TOTAL:', '', '', '', '', '', 
//       { formula: `J${subtotalRowNum}` }, 
//       '', ''
//     ]);

//     grandTotalRow.getCell(4).font = { bold: true, size: 12 };
//     grandTotalRow.getCell(10).font = { bold: true, size: 12 };
//     grandTotalRow.getCell(10).fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFFCC' }
//     };

//     // Format currency and percentage columns
//     worksheet.getColumn(5).numFmt = '#,##0.00'; // Unit Price
//     worksheet.getColumn(6).numFmt = '0.00%';    // Discount (%)
//     worksheet.getColumn(7).numFmt = '0.00%';    // GST (%)
//     worksheet.getColumn(8).numFmt = '0.00%';    // SGST (%)
//     worksheet.getColumn(9).numFmt = '0.00%';    // CGST (%)
//     worksheet.getColumn(10).numFmt = '#,##0.00'; // Total Value

//     // Add instructions
//     worksheet.addRow([]);
//     worksheet.addRow(['Instructions:']).getCell(1).font = { bold: true };
//     worksheet.addRow(['1. Please fill in the Unit Price for each item']);
//     worksheet.addRow(['2. Enter Discount percentage if applicable (e.g., 10 for 10%)']);
//     worksheet.addRow(['3. Specify GST, SGST, and CGST percentages as applicable']);
//     worksheet.addRow(['4. Total Value will be calculated automatically']);
//     worksheet.addRow(['5. Specify delivery dates for each item']);
//     worksheet.addRow(['6. Add any remarks or special conditions']);
//     worksheet.addRow(['7. Return this completed form by [DATE]']);

//     // Add notes about tax calculation
//     worksheet.addRow([]);
//     worksheet.addRow(['Tax Calculation Formula:']).getCell(1).font = { bold: true };
//     worksheet.addRow(['Total Value = ((Quantity × Unit Price) × (1 - Discount%/100)) × (1 + (GST% + SGST% + CGST%)/100)']);

//     return await workbook.xlsx.writeBuffer();
//   }

//   // Keep the original method for backward compatibility
//   async generateRfqExcel(purchaseRequestId: number): Promise<ExcelJS.Buffer> {
//     const supplierFiles = await this.generateRfqExcelsBySupplier(purchaseRequestId);
//     if (supplierFiles.length > 0) {
//       return supplierFiles[0].buffer; // Return first supplier's file
//     }
//     throw new Error('No suppliers found for this purchase request');
//   }
//   // rfq.service.ts

// async getComparativeRfqData(purchaseRequestId: number) {
//   // Get all RFQ data for this request
//   const rfqData = await this.rfqDataRepository.find({
//     where: { purchaseRequest: { id: purchaseRequestId } },
//     relations: ['supplier']
//   });

//   if (rfqData.length === 0) {
//     return { items: [], suppliers: [] };
//   }

//   // Create a map of items with their details and supplier offers
//   const itemsMap = new Map<string, any>();
//   const suppliersSet = new Set<string>();

//   rfqData.forEach(data => {
//     const supplierKey = `${data.supplier.id}-${data.supplier.name}`;
//     suppliersSet.add(supplierKey);

//     data.items.forEach(item => {
//       const itemKey = item.code || item.name;

//       if (!itemsMap.has(itemKey)) {
//         itemsMap.set(itemKey, {
//           code: item.code,
//           name: item.name,
//           uom: item.uom,
//           quantity: item.quantity,
//           suppliers: {}
//         });
//       }

//       itemsMap.get(itemKey).suppliers[supplierKey] = {
//         unitPrice: item.unitPrice,
//         discount: item.discount,
//         gst: item.gst,
//         deliveryDate: item.deliveryDate,
//         remarks: item.remarks
//       };
//     });
//   });

//   // Convert to array format
//   const items = Array.from(itemsMap.values());
//   const suppliers = Array.from(suppliersSet).map(s => {
//     const [id, name] = s.split('-');
//     return { id: parseInt(id), name };
//   });

//   return { items, suppliers };
// }
// }

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { PrDetails } from '../entities/pr-details.entity';
import * as ExcelJS from 'exceljs';
import { RfqData } from 'src/entities/rfq-data.entity';
import { RfqItem } from 'src/entities/rfq-item.entity';
import { PurchaseRequest } from 'src/entities/purchase-requests.entity';
import { Supplier } from 'src/entities/supplier.entity';

interface SupplierFile {
  filename: string;
  buffer: ExcelJS.Buffer;
  supplierId: number;
  supplierName: string;
}

@Injectable()
export class RfqService {
  constructor(
    @InjectRepository(RfqData)
    private rfqDataRepository: Repository<RfqData>,
    @InjectRepository(PrDetails)
    private prDetailsRepository: Repository<PrDetails>,

  ) { }


  async restoreRfqData(id: number): Promise<void> {
    const result = await this.rfqDataRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RFQ data with ID ${id} not found or not deleted`);
    }
  }


  async getDeletedRfqData(purchaseRequestId: number): Promise<RfqData[]> {
    return this.rfqDataRepository.find({
      where: {
        purchaseRequest: { id: purchaseRequestId },
        deletedAt: Not(IsNull())
      },
      withDeleted: true,
      relations: ['supplier']
    });
  }


  async getRfqDataWithDeleted(purchaseRequestId: number): Promise<RfqData[]> {
    return this.rfqDataRepository.find({
      where: { purchaseRequest: { id: purchaseRequestId } },
      withDeleted: true,
      relations: ['supplier']
    });
  }

  async softDeleteRfqData(id: number): Promise<void> {
    const result = await this.rfqDataRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RFQ data with ID ${id} not found`);
    }
  }



  async processRfqUpload(
    purchaseRequestId: number,
    supplierId: number,
    items: any[]
  ) {
    // Validate inputs
    if (!purchaseRequestId || !supplierId) {
      throw new BadRequestException('Missing required IDs');
    }

    if (!items?.length) {
      throw new BadRequestException('No items provided');
    }

    // Process only valid items with proper null checks
    const processedItems = items
      .filter(item => {
        try {
          return (
            item?.name &&
            typeof item.name === 'string' &&
            !item.name.match(/item name|instruction|note:|tax calculation/i) &&
            !isNaN(item.quantity) &&
            !isNaN(item.unitPrice) &&
            item.quantity > 0 &&
            item.unitPrice > 0
          );
        } catch (e) {
          return false;
        }
      })
      .map(item => ({
        name: item.name.toString().trim(),
        code: item.code?.toString().trim() || '',
        uom: item.uom?.toString().trim() || 'EA',
        quantity: Math.max(0, Number(item.quantity) || 0),
        unitPrice: Math.max(0, Number(item.unitPrice) || 0),
        discount: item.discount?.toString().trim() || '0%',
        gst: item.gst?.toString().trim() || '0%',
        sgst: item.sgst?.toString().trim() || '0%',
        cgst: item.cgst?.toString().trim() || '0%',
        totalValue: item.totalValue?.toString().trim() ||
          (Number(item.quantity) * Number(item.unitPrice)).toFixed(2),
        deliveryDate: item.deliveryDate?.toString().trim() || '',
        remarks: item.remarks?.toString().trim() || ''
      }));

    if (processedItems.length === 0) {
      throw new BadRequestException('No valid items after processing');
    }

    // Find all existing records (including soft-deleted)
    const existingRecords = await this.rfqDataRepository.find({
      where: {
        purchaseRequest: { id: purchaseRequestId },
        supplier: { id: supplierId }
      },
      withDeleted: true,
      order: { uploadedAt: 'DESC' }
    });

    // If we have existing records
    if (existingRecords.length > 0) {
      // Soft-delete all old records
      await this.rfqDataRepository.softDelete(
        existingRecords.map(record => record.id)
      );

      // Create new record with current data
      const newRfqData = this.rfqDataRepository.create({
        purchaseRequest: { id: purchaseRequestId },
        supplier: { id: supplierId },
        items: processedItems,
        uploadedAt: new Date()
      });

      const savedData = await this.rfqDataRepository.save(newRfqData);

      return {
        success: true,
        message: 'RFQ data updated successfully',
        data: {
          id: savedData.id,
          purchaseRequest: { id: savedData.purchaseRequest.id },
          supplier: { id: savedData.supplier.id },
          items: savedData.items,
          uploadedAt: savedData.uploadedAt
        },
        statusCode: 200
      };
    }

    // If no existing records, create new one
    const rfqData = this.rfqDataRepository.create({
      purchaseRequest: { id: purchaseRequestId },
      supplier: { id: supplierId },
      items: processedItems,
      uploadedAt: new Date()
    });

    const savedData = await this.rfqDataRepository.save(rfqData);

    return {
      success: true,
      message: 'New RFQ data created successfully',
      data: {
        id: savedData.id,
        purchaseRequest: { id: savedData.purchaseRequest.id },
        supplier: { id: savedData.supplier.id },
        items: savedData.items,
        uploadedAt: savedData.uploadedAt
      },
      statusCode: 201
    };
  }
  // async processRfqUpload(
  //   purchaseRequestId: number,
  //   supplierId: number,
  //   items: any[]
  // ) {
  //   // Validate inputs (keep your existing validation)
  //   if (!purchaseRequestId || !supplierId) {
  //     throw new Error('Missing required IDs');
  //   }

  //   if (!items?.length) {
  //     throw new Error('No items provided');
  //   }

  //   // Process only valid items (keep your existing processing)
  //   const processedItems = items
  //     .filter(item => 
  //       item?.name && 
  //       !item.name.toString().match(/item name|instruction|note:|tax calculation/i) &&
  //       (item.quantity > 0 || item.unitPrice > 0)
  //     )
  //     .map(item => ({
  //       name: item.name.toString().trim(),
  //       code: item.code?.toString().trim() || '',
  //       uom: item.uom?.toString().trim() || 'EA',
  //       quantity: Math.max(0, Number(item.quantity) || 0),
  //       unitPrice: Math.max(0, Number(item.unitPrice) || 0),
  //       discount: item.discount?.toString().trim() || '0%',
  //       gst: item.gst?.toString().trim() || '0%',
  //       sgst: item.sgst?.toString().trim() || '0%',
  //       cgst: item.cgst?.toString().trim() || '0%',
  //       totalValue: item.totalValue?.toString().trim() || 
  //                  (Number(item.quantity) * Number(item.unitPrice)).toFixed(2),
  //       deliveryDate: item.deliveryDate?.toString().trim() || '',
  //       remarks: item.remarks?.toString().trim() || ''
  //     }));

  //   if (processedItems.length === 0) {
  //     throw new Error('No valid items after processing');
  //   }

  //   // FIRST check for ANY existing record (active or soft-deleted)
  //   const existingRecord = await this.rfqDataRepository.findOne({
  //     where: {
  //       purchaseRequest: { id: purchaseRequestId },
  //       supplier: { id: supplierId }
  //     },
  //     withDeleted: true // This is crucial
  //   });

  //   if (existingRecord) {
  //     // If record was soft-deleted, restore it first
  //     if (existingRecord.deletedAt) {
  //       await this.rfqDataRepository.restore(existingRecord.id);
  //     }

  //     // Update the existing record
  //     await this.rfqDataRepository.update(existingRecord.id, {
  //       items: processedItems as any,
  //       uploadedAt: new Date()
  //     });

  //     // Return the updated record with proper filtering
  //     const updatedData = await this.rfqDataRepository.findOne({
  //       where: { id: existingRecord.id },
  //       relations: ['supplier', 'purchaseRequest']
  //     });

  //     if (!updatedData) {
  //       throw new Error('Failed to retrieve updated RFQ data');
  //     }

  //     return {
  //       id: updatedData.id,
  //       purchaseRequest: { id: updatedData.purchaseRequest.id },
  //       supplier: { id: updatedData.supplier.id },
  //       items: updatedData.items.filter(item => 
  //         !item.name.match(/item name|instruction|note:|tax calculation/i)
  //       ),
  //       uploadedAt: updatedData.uploadedAt,
  //       warning: 'duplicate' // Flag to indicate this was an update
  //     };
  //   }

  //   // Only create new record if no existing record found
  //   const rfqData = this.rfqDataRepository.create({
  //     purchaseRequest: { id: purchaseRequestId },
  //     supplier: { id: supplierId },
  //     items: processedItems,
  //     uploadedAt: new Date()
  //   });

  //   const savedData = await this.rfqDataRepository.save(rfqData);

  //   return {
  //     id: savedData.id,
  //     purchaseRequest: { id: savedData.purchaseRequest.id },
  //     supplier: { id: savedData.supplier.id },
  //     items: savedData.items.filter(item => 
  //       !item.name.match(/item name|instruction|note:|tax calculation/i)
  //     ),
  //     uploadedAt: savedData.uploadedAt
  //   };
  // }

  // private async getUpdatedRfqData(id: number) {
  //   const data = await this.rfqDataRepository.findOne({
  //     where: { id },
  //     relations: ['supplier', 'purchaseRequest']
  //   });
  //   if (!data) throw new Error('Failed to fetch updated RFQ data');
  //   return data;
  // }



  // async processRfqUpload(
  //   purchaseRequestId: number,
  //   supplierId: number,
  //   items: any[]
  // ) {
  //   // Validate inputs
  //   if (!purchaseRequestId || !supplierId) {
  //     throw new Error('Missing required IDs');
  //   }

  //   if (!items?.length) {
  //     throw new Error('No items provided');
  //   }




  //   // Process only valid items
  //   const processedItems = items
  //     .filter(item => 
  //       item?.name && 
  //       !item.name.toString().match(/item name|instruction|note:|tax calculation/i) &&
  //       (item.quantity > 0 || item.unitPrice > 0)
  //     )
  //     .map(item => ({
  //       name: item.name.toString().trim(),
  //       code: item.code?.toString().trim() || '',
  //       uom: item.uom?.toString().trim() || 'EA',
  //       quantity: Math.max(0, Number(item.quantity) || 0),
  //       unitPrice: Math.max(0, Number(item.unitPrice) || 0),
  //       discount: item.discount?.toString().trim() || '0%',
  //       gst: item.gst?.toString().trim() || '0%',
  //       sgst: item.sgst?.toString().trim() || '0%',
  //       cgst: item.cgst?.toString().trim() || '0%',
  //       totalValue: item.totalValue?.toString().trim() || 
  //                  (Number(item.quantity) * Number(item.unitPrice)).toFixed(2),
  //       deliveryDate: item.deliveryDate?.toString().trim() || '',
  //       remarks: item.remarks?.toString().trim() || ''
  //     }));

  //   if (processedItems.length === 0) {
  //     throw new Error('No valid items after processing');
  //   }


  // // FIRST check for existing ACTIVE record
  // const existingActive = await this.rfqDataRepository.findOne({
  //   where: {
  //     purchaseRequest: { id: purchaseRequestId },
  //     supplier: { id: supplierId },
  //     deletedAt: IsNull() // Only non-deleted records
  //   }
  // });



  // if (existingActive) {
  //   // UPDATE existing active record
  //   await this.rfqDataRepository.update(existingActive.id, {
  //     items: processedItems as any,
  //     uploadedAt: new Date()
  //   });
  //   return this.getUpdatedRfqData(existingActive.id);
  // }


  //   // THEN check for soft-deleted record
  //   const existingDeleted = await this.rfqDataRepository.findOne({
  //     where: {
  //       purchaseRequest: { id: purchaseRequestId },
  //       supplier: { id: supplierId },
  //       deletedAt: Not(IsNull())
  //     },
  //     withDeleted: true
  //   });

  //   if (existingDeleted) {
  //     // RESTORE and UPDATE soft-deleted record
  //     await this.rfqDataRepository.restore(existingDeleted.id);
  //     await this.rfqDataRepository.update(existingDeleted.id, {
  //       items: processedItems as any,
  //       uploadedAt: new Date(),
  //       // deletedAt: null // Explicitly clear deletedAt
  //     });
  //     return this.getUpdatedRfqData(existingDeleted.id);
  //   }



  //   // Save to database
  //   const rfqData = this.rfqDataRepository.create({
  //     purchaseRequest: { id: purchaseRequestId }, 
  //     supplier: { id: supplierId },
  //     items: processedItems,
  //     uploadedAt: new Date()
  //   });

  //   const savedData = await this.rfqDataRepository.save(rfqData);

  //   // Return clean response without header row
  //   return {
  //     id: savedData.id,
  //     purchaseRequest: { id: savedData.purchaseRequest.id },
  //     supplier: { id: savedData.supplier.id },
  //     items: savedData.items.filter(item => 
  //       !item.name.match(/item name|instruction|note:|tax calculation/i)
  //     ),
  //     uploadedAt: savedData.uploadedAt
  //   };
  // }

  // async processRfqUpload(
  //   purchaseRequestId: number,
  //   supplierId: number,
  //   items: any[]
  // ) {
  //   // Validate inputs
  //   if (!purchaseRequestId || !supplierId) {
  //     throw new Error('Missing required IDs');
  //   }

  //   if (!items?.length) {
  //     throw new Error('No items provided');
  //   }

  //   // Process items (same as before)
  //   const processedItems = items
  //     .filter(item => 
  //       item?.name && 
  //       !item.name.toString().match(/item name|instruction|note:|tax calculation/i) &&
  //       (item.quantity > 0 || item.unitPrice > 0)
  //     )
  //     .map(item => ({
  //       // ... same mapping as before
  //     }));

  //   if (processedItems.length === 0) {
  //     throw new Error('No valid items after processing');
  //   }

  //   // Check for existing records (both active and soft-deleted)
  //   const existingRecords = await this.rfqDataRepository.find({
  //     where: {
  //       purchaseRequest: { id: purchaseRequestId },
  //       supplier: { id: supplierId }
  //     },
  //     withDeleted: true,
  //     order: { uploadedAt: 'DESC' }
  //   });

  //   // If we have existing records
  //   if (existingRecords.length > 0) {
  //     // Soft-delete all old records except the most recent one
  //     for (const record of existingRecords) {
  //       if (!record.deletedAt) {
  //         await this.rfqDataRepository.softDelete(record.id);
  //       }
  //     }

  //     // Create a new record (rather than updating the old one)
  //     const newRfqData = this.rfqDataRepository.create({
  //       purchaseRequest: { id: purchaseRequestId },
  //       supplier: { id: supplierId },
  //       items: processedItems,
  //       uploadedAt: new Date()
  //     });

  //     const savedData = await this.rfqDataRepository.save(newRfqData);

  //     return {
  //       success: true,
  //       message: 'RFQ data updated successfully',
  //       data: {
  //         id: savedData.id,
  //         purchaseRequest: { id: savedData.purchaseRequest.id },
  //         supplier: { id: savedData.supplier.id },
  //         items: savedData.items.filter(item => 
  //           !item.name.match(/item name|instruction|note:|tax calculation/i)
  //         ),
  //         uploadedAt: savedData.uploadedAt
  //       },
  //       statusCode: 200
  //     };
  //   }

  //   // If no existing records, create new one
  //   const rfqData = this.rfqDataRepository.create({
  //     purchaseRequest: { id: purchaseRequestId },
  //     supplier: { id: supplierId },
  //     items: processedItems,
  //     uploadedAt: new Date()
  //   });

  //   const savedData = await this.rfqDataRepository.save(rfqData);

  //   return {
  //     success: true,
  //     message: 'New RFQ data created successfully',
  //     data: {
  //       id: savedData.id,
  //       purchaseRequest: { id: savedData.purchaseRequest.id },
  //       supplier: { id: savedData.supplier.id },
  //       items: savedData.items.filter(item => 
  //         !item.name.match(/item name|instruction|note:|tax calculation/i)
  //       ),
  //       uploadedAt: savedData.uploadedAt
  //     },
  //     statusCode: 201
  //   };
  // }



  // async getRfqDataForRequest(purchaseRequestId: number) {
  //   return  this.rfqDataRepository.find({
  //     where: { purchaseRequest: { id: purchaseRequestId } },
  //     relations: ['supplier']
  //   });
  // }


  async getRfqDataForRequest(purchaseRequestId: number) {
    return this.rfqDataRepository.find({
      where: {
        purchaseRequest: { id: purchaseRequestId },
        // Explicitly exclude soft-deleted records
        deletedAt: IsNull()
      },
      relations: ['supplier']
    });
  }


  // async generateRfqExcelsBySupplier(purchaseRequestId: number): Promise<SupplierFile[]> {
  //   // Get all PR details for this request with related items and suppliers
  //   const prDetails = await this.prDetailsRepository.find({
  //     where: { purchase_request: { id: purchaseRequestId } },
  //     relations: ['item', 'supplier', 'suggestion_item', 'suggestion_supplier'],
  //   });

  //   // Group data by supplier
  //   const supplierData = new Map();

  //   prDetails.forEach(detail => {
  //     const supplier = detail.supplier || detail.suggestion_supplier;
  //     if (!supplier) return;

  //     const supplierId = supplier.id;
  //     const supplierName = supplier.name;
  //     const supplierCode = supplier.code;

  //     if (!supplierData.has(supplierId)) {
  //       supplierData.set(supplierId, {
  //         id: supplierId,
  //         name: supplierName,
  //         code: supplierCode,
  //         items: new Map()
  //       });
  //     }

  //     const itemKey = detail.item.id;
  //     if (!supplierData.get(supplierId).items.has(itemKey)) {
  //       supplierData.get(supplierId).items.set(itemKey, {
  //         itemName: detail.item.item_name,
  //         itemCode: detail.item.item_code,
  //         uom: detail.item.uom,
  //         quantity: detail.quantity,
  //       });
  //     }
  //   });

  //   // Generate Excel file for each supplier
  //   const supplierFiles: SupplierFile[] = [];

  //   for (const [supplierId, supplier] of supplierData) {
  //     const buffer = await this.generateExcelForSingleSupplier(
  //       purchaseRequestId,
  //       supplier
  //     );

  //     supplierFiles.push({
  //       filename: `RFQ_${purchaseRequestId}_${supplier.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
  //       buffer,
  //       supplierId: supplier.id,
  //       supplierName: supplier.name
  //     });
  //   }

  //   return supplierFiles;
  // }



  async generateRfqExcelsBySupplier(purchaseRequestId: number): Promise<SupplierFile[]> {
    // Get all PR details for this request with related items and suppliers
    const prDetails = await this.prDetailsRepository.find({
        where: { purchase_request: { id: purchaseRequestId } },
        relations: ['item', 'supplier', 'suggestion_item', 'suggestion_supplier'],
    });

    // Group data by supplier
    const supplierData = new Map();

    prDetails.forEach(detail => {
        // Skip if no item is associated
        if (!detail.item && !detail.suggestion_item) {
            console.warn(`PR detail ${detail.id} has no associated item`);
            return;
        }

        const supplier = detail.supplier || detail.suggestion_supplier;
        if (!supplier) {
            console.warn(`PR detail ${detail.id} has no associated supplier`);
            return;
        }

        const supplierId = supplier.id;
        const supplierName = supplier.name;
        const supplierCode = supplier.code;

        if (!supplierData.has(supplierId)) {
            supplierData.set(supplierId, {
                id: supplierId,
                name: supplierName,
                code: supplierCode,
                items: new Map()
            });
        }

        // Use either item or suggestion_item
        const item = detail.item || detail.suggestion_item;
        const itemKey = item.id;
        
        if (!supplierData.get(supplierId).items.has(itemKey)) {
            supplierData.get(supplierId).items.set(itemKey, {
                itemName: item.item_name,
                itemCode: item.item_code || '', // Handle possible null
                uom: item.uom || 'EA', // Default to 'EA' if null
                quantity: detail.quantity,
            });
        }
    });

    // Generate Excel file for each supplier
    const supplierFiles: SupplierFile[] = [];

    for (const [supplierId, supplier] of supplierData) {
        try {
            const buffer = await this.generateExcelForSingleSupplier(
                purchaseRequestId,
                supplier
            );

            supplierFiles.push({
                filename: `RFQ_${purchaseRequestId}_${supplier.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
                buffer,
                supplierId: supplier.id,
                supplierName: supplier.name
            });
        } catch (error) {
            console.error(`Error generating RFQ for supplier ${supplierId}:`, error);
            // Continue with other suppliers even if one fails
        }
    }

    if (supplierFiles.length === 0) {
        throw new Error('No valid suppliers with items found for this purchase request');
    }

    return supplierFiles;
}




  async generateRfqExcelForSupplier(purchaseRequestId: number, supplierId: number): Promise<ExcelJS.Buffer> {
    // Get PR details for specific supplier
    const prDetails = await this.prDetailsRepository.find({
      where: {
        purchase_request: { id: purchaseRequestId },
        supplier: { id: supplierId }
      },
      relations: ['item', 'supplier'],
    });

    if (prDetails.length === 0) {
      // Try with suggestion_supplier
      const suggestionDetails = await this.prDetailsRepository.find({
        where: {
          purchase_request: { id: purchaseRequestId },
          suggestion_supplier: { id: supplierId }
        },
        relations: ['item', 'suggestion_supplier'],
      });
      prDetails.push(...suggestionDetails);
    }

    const supplier = prDetails[0]?.supplier || prDetails[0]?.suggestion_supplier;
    if (!supplier) {
      throw new Error(`Supplier with ID ${supplierId} not found for this purchase request`);
    }

    // Process items for this supplier
    const items = new Map();
    prDetails.forEach(detail => {
      const itemKey = detail.item.id;
      if (!items.has(itemKey)) {
        items.set(itemKey, {
          itemName: detail.item.item_name,
          itemCode: detail.item.item_code,
          uom: detail.item.uom,
          quantity: detail.quantity,
        });
      }
    });

    return await this.generateExcelForSingleSupplier(purchaseRequestId, {
      id: supplier.id,
      name: supplier.name,
      code: supplier.code,
      items
    });
  }

  private async generateExcelForSingleSupplier(
    purchaseRequestId: number,
    supplier: any
  ): Promise<ExcelJS.Buffer> {
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`RFQ - ${supplier.name}`);

    // Add title and supplier info
    worksheet.mergeCells('A1:L1'); // Extended to column L for new headers
    worksheet.getCell('A1').value = `Request for Quotation - Purchase Request #${purchaseRequestId}`;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:L2'); // Extended to column L for new headers
    worksheet.getCell('A2').value = `Supplier: ${supplier.name} (${supplier.code})`;
    worksheet.getCell('A2').font = { bold: true, size: 12 };

    // Add empty row
    worksheet.addRow([]);

    // Add headers with new tax columns
    const headerRow = worksheet.addRow([
      'Item Name',
      'Item Code',
      'UOM',
      'Quantity',
      'Unit Price',
      'Discount (%)',
      'GST (%)',
      'SGST (%)',
      'CGST (%)',
      'Total Value',
      'Delivery Date',
      'Remarks'
    ]);

    // Style headers
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Set column widths
    worksheet.columns = [
      { width: 30 }, // Item Name
      { width: 15 }, // Item Code
      { width: 10 }, // UOM
      { width: 10 }, // Quantity
      { width: 12 }, // Unit Price
      { width: 12 }, // Discount (%)
      { width: 10 }, // GST (%)
      { width: 10 }, // SGST (%)
      { width: 10 }, // CGST (%)
      { width: 15 }, // Total Value
      { width: 15 }, // Delivery Date
      { width: 20 }, // Remarks
    ];

    // Add data rows
    supplier.items.forEach((item) => {
      const currentRow = worksheet.rowCount + 1;
      const row = worksheet.addRow([
        item.itemName,
        item.itemCode,
        item.uom,
        item.quantity,
        '', // Unit Price - to be filled by supplier
        '', // Discount (%) - to be filled by supplier
        '', // GST (%) - to be filled by supplier
        '', // SGST (%) - to be filled by supplier
        '', // CGST (%) - to be filled by supplier
        {
          // Total Value formula: (Quantity * Unit Price) - Discount + GST + SGST + CGST
          // Formula: ((D*E) * (1 - F/100)) * (1 + (G+H+I)/100)
          formula: `((D${currentRow}*E${currentRow})*(1-F${currentRow}/100))*(1+(G${currentRow}+H${currentRow}+I${currentRow})/100)`
        },
        '', // Delivery Date - to be filled by supplier
        '' // Remarks - to be filled by supplier
      ]);

      // Add borders to data rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Add subtotal, tax, and total rows
    const subtotalRowNum = worksheet.rowCount + 1;
    const subtotalRow = worksheet.addRow([
      '', '', '', 'SUBTOTAL:', '', '', '', '', '',
      { formula: `SUM(J5:J${worksheet.rowCount})` },
      '', ''
    ]);

    subtotalRow.getCell(4).font = { bold: true };
    subtotalRow.getCell(10).font = { bold: true };
    subtotalRow.getCell(10).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };

    // Add total tax row
    const taxRowNum = worksheet.rowCount + 1;
    const taxRow = worksheet.addRow([
      '', '', '', 'TOTAL TAX:', '', '', '', '', '',
      { formula: `J${subtotalRowNum}-SUM(D5:D${subtotalRowNum - 1}*E5:E${subtotalRowNum - 1}*(1-F5:F${subtotalRowNum - 1}/100))` },
      '', ''
    ]);

    taxRow.getCell(4).font = { bold: true };
    taxRow.getCell(10).font = { bold: true };
    taxRow.getCell(10).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB' }
    };

    // Add grand total row
    const grandTotalRow = worksheet.addRow([
      '', '', '', 'GRAND TOTAL:', '', '', '', '', '',
      { formula: `J${subtotalRowNum}` },
      '', ''
    ]);

    grandTotalRow.getCell(4).font = { bold: true, size: 12 };
    grandTotalRow.getCell(10).font = { bold: true, size: 12 };
    grandTotalRow.getCell(10).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFCC' }
    };

    // Format currency and percentage columns
    worksheet.getColumn(5).numFmt = '#,##0.00'; // Unit Price
    worksheet.getColumn(6).numFmt = '0.00%';    // Discount (%)
    worksheet.getColumn(7).numFmt = '0.00%';    // GST (%)
    worksheet.getColumn(8).numFmt = '0.00%';    // SGST (%)
    worksheet.getColumn(9).numFmt = '0.00%';    // CGST (%)
    worksheet.getColumn(10).numFmt = '#,##0.00'; // Total Value

    // Add instructions
    worksheet.addRow([]);
    worksheet.addRow(['Instructions:']).getCell(1).font = { bold: true };
    worksheet.addRow(['1. Please fill in the Unit Price for each item']);
    worksheet.addRow(['2. Enter Discount percentage if applicable (e.g., 10 for 10%)']);
    worksheet.addRow(['3. Specify GST, SGST, and CGST percentages as applicable']);
    worksheet.addRow(['4. Total Value will be calculated automatically']);
    worksheet.addRow(['5. Specify delivery dates for each item']);
    worksheet.addRow(['6. Add any remarks or special conditions']);
    worksheet.addRow(['7. Return this completed form by [DATE]']);

    // Add notes about tax calculation
    worksheet.addRow([]);
    worksheet.addRow(['Tax Calculation Formula:']).getCell(1).font = { bold: true };
    worksheet.addRow(['Total Value = ((Quantity × Unit Price) × (1 - Discount%/100)) × (1 + (GST% + SGST% + CGST%)/100)']);

    return await workbook.xlsx.writeBuffer();
  }

  // Keep the original method for backward compatibility
  async generateRfqExcel(purchaseRequestId: number): Promise<ExcelJS.Buffer> {
    const supplierFiles = await this.generateRfqExcelsBySupplier(purchaseRequestId);
    if (supplierFiles.length > 0) {
      return supplierFiles[0].buffer; // Return first supplier's file
    }
    throw new Error('No suppliers found for this purchase request');
  }
  // rfq.service.ts

  async getComparativeRfqData(purchaseRequestId: number) {
    // Get all RFQ data for this request
    const rfqData = await this.rfqDataRepository.find({
      where: {
        purchaseRequest: { id: purchaseRequestId },
        // Explicitly exclude soft-deleted records
        deletedAt: IsNull()
      },
      relations: ['supplier']
    });

    if (rfqData.length === 0) {
      return { items: [], suppliers: [] };
    }

    // Create a map of items with their details and supplier offers
    const itemsMap = new Map<string, any>();
    const suppliersSet = new Set<string>();

    rfqData.forEach(data => {
      const supplierKey = `${data.supplier.id}-${data.supplier.name}`;
      suppliersSet.add(supplierKey);

      data.items.forEach(item => {
        const itemKey = item.code || item.name;

        if (!itemsMap.has(itemKey)) {
          itemsMap.set(itemKey, {
            code: item.code,
            name: item.name,
            uom: item.uom,
            quantity: item.quantity,
            suppliers: {}
          });
        }

        itemsMap.get(itemKey).suppliers[supplierKey] = {
          unitPrice: item.unitPrice,
          discount: item.discount,
          gst: item.gst,
          deliveryDate: item.deliveryDate,
          remarks: item.remarks
        };
      });
    });

    // Convert to array format
    const items = Array.from(itemsMap.values());
    const suppliers = Array.from(suppliersSet).map(s => {
      const [id, name] = s.split('-');
      return { id: parseInt(id), name };
    });

    return { items, suppliers };
  }
}