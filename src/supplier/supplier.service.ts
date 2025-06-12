import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/common/crud/api.service';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Supplier } from 'src/entities/supplier.entity';
import { SupplierDetails } from 'src/entities/supplier-details.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SupplierService extends ApiService<Supplier> {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepository: Repository<Supplier>,

        @InjectRepository(SupplierDetails)
        private readonly supplierDetailRepository: Repository<SupplierDetails>,
    ) {
        super(supplierRepository);
    }


    async create(data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
        const supplier = this.supplierRepository.create(data);
        const result = await this.supplierRepository.save(supplier);
        return {
            success: true,
            data: result,
            message: 'Supplier created successfully',
            statusCode: 201
        };
    }
    
    async findAll(): Promise<ApiResponse<Supplier[]>> {
        const suppliers = await this.supplierRepository.find({ relations: ['details'] });
      
        return {
          success: true,
          data: suppliers,
          message: 'All suppliers fetched successfully',
          statusCode: 200,
        };
      }
      

    // async findAll(): Promise<ApiResponse<Supplier[]>> {
    //     return super.findAll();
    // }

    async findOne(id: string): Promise<ApiResponse<Supplier>> {
        try {
          const supplier = await this.supplierRepository.findOne({
            where: { id: +id },
            relations: ['details'], // include details
          });
      
          if (!supplier) {
            return {
              success: false,
              data: null,
              message: 'Supplier not found',
              statusCode: 404,
            };
          }
      
          return {
            success: true,
            data: supplier,
            message: 'Supplier fetched successfully',
            statusCode: 200,
          };
        } catch (error) {
          return {
            success: false,
            data: null,
            message: 'Error fetching supplier',
            statusCode: 500,
          };
        }
      }
      
      async update(id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
        try {
          const supplier = await this.supplierRepository.findOne({
            where: { id: +id },
            relations: ['details'],
          });
      
          if (!supplier) {
            return {
              success: false,
              data: null,
              message: 'Supplier not found',
              statusCode: 404,
            };
          }
      
          // Merge data and save
          const updated = this.supplierRepository.merge(supplier, data);
          const saved = await this.supplierRepository.save(updated);
      
          return {
            success: true,
            data: saved,
            message: 'Supplier updated successfully',
            statusCode: 200,
          };
        } catch (error) {
          return {
            success: false,
            data: null,
            message: 'Failed to update supplier',
            statusCode: 500,
          };
        }
      }
      

      async remove(id: string): Promise<ApiResponse<Supplier>> {
        try {
          const supplier = await this.supplierRepository.findOne({
            where: { id: +id },
            relations: ['details'],
          });
      
          if (!supplier) {
            return {
              success: false,
              data: null,
              message: 'Supplier not found',
              statusCode: 404,
            };
          }
      
          await this.supplierRepository.remove(supplier);
      
          return {
            success: true,
            data: supplier,
            message: 'Supplier deleted successfully',
            statusCode: 200,
          };
        } catch (error) {
          return {
            success: false,
            data: null,
            message: 'Failed to delete supplier',
            statusCode: 500,
          };
        }
      }
      
}
