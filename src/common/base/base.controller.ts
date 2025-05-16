import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BaseService } from './base.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { BaseEntity } from 'typeorm';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export abstract class BaseController<T extends BaseEntity> {
  protected constructor(private readonly baseService: BaseService<T>) {}

  @Get()
  async findAll(): Promise<ApiResponse<T[]>> {
    return this.baseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<T>> {
    return this.baseService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<T>): Promise<ApiResponse<T>> {
    return this.baseService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<T>,
  ): Promise<ApiResponse<T>> {
    return this.baseService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<T>> {
    return this.baseService.remove(id);
  }
}
