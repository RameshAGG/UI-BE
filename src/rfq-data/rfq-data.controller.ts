// src/rfq-data/rfq-data.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RfqDataService } from './rfq-data.service';

@Controller('purchase-requests/:id/rfq-data')
export class RfqDataController {
  constructor(private readonly rfqDataService: RfqDataService) {}

  @Post()
  async create(
    @Param('id') purchaseRequestId: string,
    @Body() body: { supplierId: number; items: any[] },
  ) {
    return this.rfqDataService.createRfqData(
      parseInt(purchaseRequestId),
      body.supplierId,
      body.items,
    );
  }

  @Get()
  async findAll(@Param('id') purchaseRequestId: string) {
    return this.rfqDataService.getRfqDataByRequest(parseInt(purchaseRequestId));
  }
}