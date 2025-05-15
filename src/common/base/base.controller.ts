import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResponseUtil } from '../utils/response.util';

@Controller()
@UseGuards(JwtAuthGuard)
export class BaseController {
  constructor(private readonly service: any) {}

  @Post()
  async create(@Body() createDto: any) {
    const data = await this.service.create(createDto);
    return ResponseUtil.success(data, 'Created successfully', HttpStatus.CREATED);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return ResponseUtil.success(data, 'Retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return ResponseUtil.success(data, 'Retrieved successfully');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const data = await this.service.update(id, updateDto);
    return ResponseUtil.success(data, 'Updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(id);
    return ResponseUtil.success(data, 'Deleted successfully');
  }
} 
 
