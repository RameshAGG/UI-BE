import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ItemPriceService } from './item-price.service';
import { ItemPrice } from 'src/entities/item-price.entity';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('item-prices')
export class ItemPriceController {
  constructor(private readonly itemPriceService: ItemPriceService) {}

  @Get()
  getAll(): Promise<ApiResponse<ItemPrice[]>> {
    return this.itemPriceService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<ApiResponse<ItemPrice>> {
    return this.itemPriceService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<ItemPrice>): Promise<ApiResponse<ItemPrice>> {
    return this.itemPriceService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() body: Partial<ItemPrice>
  ): Promise<ApiResponse<ItemPrice>> {
    return this.itemPriceService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<ApiResponse<ItemPrice>> {
    return this.itemPriceService.remove(id);
  }
}
