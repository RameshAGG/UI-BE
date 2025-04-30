import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MasterService } from './master.service';
import { ServiceMaster } from '../entities/service_master.entity';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get()
  findAll() {
    return this.masterService.findAll()
  }

  @Post()
  create(@Body() data: ServiceMaster) {
    return this.masterService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: ServiceMaster) {
    return this.masterService.update(parseInt(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterService.remove(parseInt(id));
  }
}
