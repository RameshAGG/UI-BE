import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CustomerRequests } from '../entities/customer_requests.entity';

@Controller('requests')
export class RequestsController {
  constructor(private readonly service: RequestsService) {}

  @Post()
  create(@Body() data: Partial<CustomerRequests>) {
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
  update(@Param('id') id: string, @Body() data: Partial<CustomerRequests>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

