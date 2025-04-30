// requests.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRequests } from '../entities/customer_requests.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(CustomerRequests)
    private readonly requestRepo: Repository<CustomerRequests>,
  ) {}

  async create(data: Partial<CustomerRequests>) {
    const request = this.requestRepo.create(data);
    return await this.requestRepo.save(request);
  }

  async findAll() {
    const requests = await this.requestRepo.find({
      relations: ['customer', 'service', 'subService'],
    });
  
    return requests.map((req) => ({
      id: req.id,
      customer_id: req.customer_id,
      name: req.customer?.name,
      service_id: req.service_id,
      service_name: req.service?.name,
      sub_service_id: req.sub_service_id,
      sub_service_name: req.subService?.name,
      created_at: req.created_at,
    }));
  }
  

  async findOne(id: number) {
    const req = await this.requestRepo.findOne({
      where: { id },
      relations: ['customer', 'service', 'subService'],
    });
    if (req) {
    return {
      id: req.id,
      customer_id: req.customer_id,
      customer_name: req.customer?.name,
      service_id: req.service_id,
      service_name: req.service?.name,
      sub_service_id: req.sub_service_id,
      sub_service_name: req.subService?.name,
      created_at: req.created_at,
    };
  }
  }  

  async update(id: number, data: Partial<CustomerRequests>) {
    return await this.requestRepo.update(id, data);
  }

  async remove(id: number) {
    return await this.requestRepo.delete(id);
  }
}
