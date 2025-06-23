// src/rfq-data/rfq-data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RfqData } from 'src/entities/rfq-data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RfqDataService {
  constructor(
    @InjectRepository(RfqData)
    private rfqDataRepository: Repository<RfqData>,
  ) {}

  async createRfqData(
    purchaseRequestId: number,
    supplierId: number,
    items: any[],
  ) {
    const rfqData = this.rfqDataRepository.create({
      purchaseRequest: { id: purchaseRequestId },
      supplier: { id: supplierId },
      items: items.map(item => ({
        name: item['Item Name'],
        code: item['Item Code'],
        uom: item['UOM'],
        quantity: parseFloat(item['Quantity']),
        unitPrice: parseFloat(item['Unit Price']),
        discount: item['Discount (%)'],
        gst: item['GST (%)'],
        sgst: item['SGST (%)'],
        cgst: item['CGST (%)'],
        totalValue: item['Total Value'],
        deliveryDate: item['Delivery Date'],
        remarks: item['Remarks'],
      })),
    });

    return this.rfqDataRepository.save(rfqData);
  }

  async getRfqDataByRequest(purchaseRequestId: number) {
    return this.rfqDataRepository.find({
      where: { purchaseRequest: { id: purchaseRequestId } },
      relations: ['supplier'],
      order: { uploadedAt: 'DESC' },
    });
  }
}