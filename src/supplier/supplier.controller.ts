import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from 'src/entities/supplier.entity';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';


@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Get()
    async findAll(): Promise<ApiResponse<Supplier[]>> {
        return this.supplierService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ApiResponse<Supplier>> {
        return this.supplierService.findOne(id);
    }

    @Post()
    async create(@Body() data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
        return this.supplierService.create(data);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: Partial<Supplier>,
    ): Promise<ApiResponse<Supplier>> {
        return this.supplierService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ApiResponse<Supplier>> {
        return this.supplierService.remove(id);
    }
}
