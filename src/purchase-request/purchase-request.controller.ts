import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
  import { PurchaseRequestService } from './purchase-request.service';
  import { PurchaseRequest } from '../entities/purchase-requests.entity';
  
  interface CreatePurchaseRequestData {
    department: string;
    date_requested: Date;
    status: string;
    items: Array<{
      item_id: number;
      item_type: boolean;
      supplier: Array<{
        supplier_id: number;
      }>;
    }>;
  }
  
  @Controller('purchase-request')
  export class PurchaseRequestController {
    constructor(private readonly purchaseRequestService: PurchaseRequestService) {}
  
    @Post()
    create(@Body() data: CreatePurchaseRequestData) {
      return this.purchaseRequestService.createPurchaseRequest(data);
    }
  
    @Get()
    async findAll() {
      return this.purchaseRequestService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.purchaseRequestService.findOne(id);
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: Partial<PurchaseRequest>) {
      return this.purchaseRequestService.update(id, data);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.purchaseRequestService.remove(id);
    }
  }
  