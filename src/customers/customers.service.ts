import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { BaseService } from '../common/base/base.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class CustomersService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    protected readonly customerRepository: Repository<Customer>,
  ) {
    super(customerRepository);
  }

  async create(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return super.create(data);
  }

  async findAll(): Promise<ApiResponse<Customer[]>> {
    return super.findAll();
  }

  async findOne(id: string): Promise<ApiResponse<Customer>> {
    return super.findOne(id);
  }

  async update(id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return super.update(id, data);
  }

  async remove(id: string): Promise<ApiResponse<Customer>> {
    return super.remove(id);
  }
} 