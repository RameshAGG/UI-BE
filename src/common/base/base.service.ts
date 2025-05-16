import { Injectable } from '@nestjs/common';
import { Repository, BaseEntity } from 'typeorm';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  protected constructor(
    protected readonly repository: Repository<T>,
  ) {}

  async findAll(): Promise<ApiResponse<T[]>> {
    try {
      const data = await this.repository.find();
      return {
        success: true,
        message: 'Records retrieved successfully',
        statusCode: 200,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve records',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async findOne(id: string): Promise<ApiResponse<T>> {
    try {
      const data = await this.repository.findOne({ where: { id } as any });
      if (!data) {
        return {
          success: false,
          message: 'Record not found',
          statusCode: 404,
        };
      }
      return {
        success: true,
        message: 'Record retrieved successfully',
        statusCode: 200,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve record',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const entity = this.repository.create(data as any);
      const savedEntity = await this.repository.save(entity);
      return {
        success: true,
        message: 'Record created successfully',
        statusCode: 201,
        data: savedEntity as unknown as T,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create record',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const existingEntity = await this.findOne(id);
      if (!existingEntity.success) {
        return existingEntity;
      }

      await this.repository.update(id, data as any);
      const updatedEntity = await this.findOne(id);
      return {
        success: true,
        message: 'Record updated successfully',
        statusCode: 200,
        data: updatedEntity.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update record',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async remove(id: string): Promise<ApiResponse<T>> {
    try {
      const existingEntity = await this.findOne(id);
      if (!existingEntity.success) {
        return existingEntity;
      }

      await this.repository.softDelete(id);
      return {
        success: true,
        message: 'Record soft deleted successfully',
        statusCode: 200,
        data: existingEntity.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete record',
        statusCode: 500,
        error: error.message,
      };
    }
  }
}
