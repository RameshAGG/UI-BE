import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SuggestionSupplierService } from './suggestion-supplier.service';
import { SuggestionSupplier } from '../entities/suggestion-supplier.entity';

@Controller('suggestion-suppliers')
export class SuggestionSupplierController {
  constructor(private readonly service: SuggestionSupplierService) {}

  @Post()
  create(@Body() data: Partial<SuggestionSupplier>) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<SuggestionSupplier>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
