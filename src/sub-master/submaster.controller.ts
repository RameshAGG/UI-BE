import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { SubServiceMasterService } from './submaster.service';
import { SubServiceMaster } from '../entities/sub_service_master.entity';

@Controller('submaster')
export class SubServiceMasterController {
  constructor(private readonly subServiceMasterService: SubServiceMasterService) {}


  @Get()
  async findAll() {
    return this.subServiceMasterService.findAll();
  }

  @Get(':serviceId')
  async findByServiceId(@Param('serviceId') serviceId: number) {
    return this.subServiceMasterService.findByServiceId(serviceId);
  }

  @Post()
  async create(@Body() data: Partial<SubServiceMaster>) {
    return this.subServiceMasterService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<SubServiceMaster>) {
    return this.subServiceMasterService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.subServiceMasterService.remove(id);
  }
}
