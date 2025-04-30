import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceMaster } from '../entities/service_master.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MasterService {
    constructor(
        @InjectRepository(ServiceMaster)
        private masterRepo: Repository<ServiceMaster>,
    ) {}

    async findAll() {
        return this.masterRepo.find();
    }

    async create(data: Partial<ServiceMaster>) {
        return this.masterRepo.save(data);
    }

    async update(id: number, data: Partial<ServiceMaster>) {
        return this.masterRepo.update(id, data);
    }   

    async remove(id: number) {
        return this.masterRepo.softDelete(id); // <-- Soft delete
    }    
  
}