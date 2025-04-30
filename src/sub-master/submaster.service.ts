import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SubServiceMaster } from '../entities/sub_service_master.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceMaster } from '../entities/service_master.entity'; 

@Injectable()
export class SubServiceMasterService {
  constructor(
    @InjectRepository(SubServiceMaster)
    private subServiceRepo: Repository<SubServiceMaster>,

    @InjectRepository(ServiceMaster)
    private serviceMasterRepo: Repository<ServiceMaster>,
  ) {}

  async findAll(): Promise<any[]> {
    const subs = await this.subServiceRepo.find({ relations: ['serviceMaster'] });
  
    return subs.map((s) => ({
      id: s.id,
      name: s.name,
      service_id: s.service_id,
      service_name: s.serviceMaster?.name,
    }));
  }
  

  async findByServiceId(serviceId: number): Promise<SubServiceMaster[]> {
    return this.subServiceRepo.find({
      where: { service_id: serviceId },
    });
  }

  async create(data: Partial<SubServiceMaster>) {
    console.log('Creating SubServiceMaster with service_id:', data.service_id);
    const serviceMaster = await this.serviceMasterRepo.findOne({
      where: { id: data.service_id }
    });
  
    const newSubService = this.subServiceRepo.create(data);
    return this.subServiceRepo.save(newSubService);
  }
  

  async update(id: number, data: Partial<SubServiceMaster>): Promise<void> {
    const subService = await this.subServiceRepo.findOne({ where: { id } });
    if (!subService) {
      throw new Error('SubServiceMaster not found');
    }
    await this.subServiceRepo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    const subService = await this.subServiceRepo.findOne({ where: { id } });
    if (!subService) {
      throw new Error('SubServiceMaster not found');
    }
    await this.subServiceRepo.softDelete(id);
  }
}
