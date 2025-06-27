import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
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
  constructor(private readonly purchaseRequestService: PurchaseRequestService) { }

  @Post()
  create(@Body() data: CreatePurchaseRequestData) {
    return this.purchaseRequestService.createPurchaseRequest(data);
  }



  @Get()
  async findAll(
    @Query('searchInput') searchInput?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: string
  ) {
    return this.purchaseRequestService.findAll({
      searchInput,
      offset: parseInt(offset ?? '0'),
      limit: parseInt(limit ?? '10'),
      sortField,
      sortOrder: parseInt(sortOrder ?? '1'),
    });
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
