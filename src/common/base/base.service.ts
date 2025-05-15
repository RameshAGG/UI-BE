import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { ResponseUtil } from '../utils/response.util';
import { ApiResponse } from '../interfaces/api-response.interface';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const entity = this.repository.create(data as any);
    const savedEntity = await this.repository.save(entity);
    return ResponseUtil.success(savedEntity, 'Created successfully', HttpStatus.CREATED) as unknown as ApiResponse<T>;
  }

  async findAll(): Promise<ApiResponse<T[]>> {
    const entities = await this.repository.find();
    return ResponseUtil.success(entities, 'Retrieved successfully');
  }

  async findOne(id: string | number): Promise<ApiResponse<T>> {
    const entity = await this.repository.findOne({ 
      where: { id } as unknown as FindOptionsWhere<T> 
    });
    if (!entity) {
      return ResponseUtil.error('Entity not found', HttpStatus.NOT_FOUND) as unknown as ApiResponse<T>;
    }
    return ResponseUtil.success(entity, 'Retrieved successfully');
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    const entity = await this.repository.findOne({ 
      where: { id } as unknown as FindOptionsWhere<T> 
    });
    if (!entity) {
      return ResponseUtil.error('Entity not found', HttpStatus.NOT_FOUND) as unknown as ApiResponse<T>;
    }
    
    const updatedEntity = await this.repository.save({
      ...entity,
      ...data,
    });
    return ResponseUtil.success(updatedEntity, 'Updated successfully');
  }

  async remove(id: string | number): Promise<ApiResponse<T>> {
    const entity = await this.repository.findOne({ 
      where: { id } as unknown as FindOptionsWhere<T> 
    });
    if (!entity) {
      return ResponseUtil.error('Entity not found', HttpStatus.NOT_FOUND) as unknown as ApiResponse<T>;
    }
    
    await this.repository.remove(entity);
    return ResponseUtil.success(entity, 'Deleted successfully');
  }
} 