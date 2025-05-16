import { Injectable, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { ResponseUtil } from '../utils/response.util';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class ApiService<T extends ObjectLiteral> {
  constructor(
    @InjectRepository(Repository)
    private readonly repository: Repository<T>,
  ) {}

  async findAll(options: any = {}): Promise<any> {
    try {
      const { relations = [], where = {}, order = {}, skip = 0, take = 10 } = options;
      const [data, total] = await this.repository.findAndCount({
        where,
        relations,
        order,
        skip,
        take,
      });

      return ResponseUtil.success({
        data,
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number | string, options: any = {}): Promise<any> {
    try {
      const { relations = [] } = options;
      const data = await this.repository.findOne({
        where: { id } as any,
        relations,
      });

      if (!data) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      return ResponseUtil.success(data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(dto: any): Promise<any> {
    try {
      const entity = this.repository.create(dto);
      const data = await this.repository.save(entity);
      return ResponseUtil.success(data, 'Record created successfully');
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number | string, dto: any): Promise<any> {
    try {
      const existingRecord = await this.repository.findOne({
        where: { id } as any,
      });

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      const updatedEntity = this.repository.merge(existingRecord, dto);
      const data = await this.repository.save(updatedEntity);
      return ResponseUtil.success(data, 'Record updated successfully');
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number | string): Promise<any> {
    try {
      const existingRecord = await this.repository.findOne({
        where: { id } as any,
      });

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      await this.repository.remove(existingRecord);
      return ResponseUtil.success(null, 'Record deleted successfully');
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 