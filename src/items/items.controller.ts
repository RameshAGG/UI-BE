import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Item } from 'src/entities/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  @Post()
  async create(@Body() body: any): Promise<ApiResponse<Item>> {
    return this.itemService.create(body);
  }

  @Get()
  async findAll(): Promise<ApiResponse<Item[]>> {
    return this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Item>> {
    return this.itemService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any): Promise<ApiResponse<Item>> {
    return this.itemService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Item>> {
    return this.itemService.remove(id);
  }
}
