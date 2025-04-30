import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CustomerDetails } from '../entities/customer_details.entity';
import { CustomerDocuments } from '../entities/customer_documents.entity';
import { CustomerDevices } from '../entities/customer_devices.entity';
import { CustomerRequests } from '../entities/customer_requests.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(CustomerDetails)
    private detailsRepo: Repository<CustomerDetails>,

    @InjectRepository(CustomerDocuments)
    private docsRepo: Repository<CustomerDocuments>,

    @InjectRepository(CustomerDevices)
    private devicesRepo: Repository<CustomerDevices>,

    @InjectRepository(CustomerRequests)
    private requestsRepo: Repository<CustomerRequests>,

    private dataSource: DataSource,
  ) {}


  async create(data: any) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const customer = new Customer();
        customer.name = data.name;
        customer.email = data.email;
        customer.mobile = data.mobile;
        customer.age = data.age;
        customer.status = data.status;
  
        const savedCustomer = await manager.save(customer);
  
        const details = new CustomerDetails();
        Object.assign(details, data.details);
        details.customer_id = savedCustomer.id;
        await manager.save(details);
  
        const documents = new CustomerDocuments();
        Object.assign(documents, data.documents);
        documents.customer_id = savedCustomer.id;
  
        if (data.upload_file) {
          documents.file_path = data.upload_file; 
          console.log('Upload file path:', data.upload_file);
        }
  
        await manager.save(documents);
  
        return {
          message: 'Customer created successfully',
          customer_id: savedCustomer.id,
          upload_file: data.upload_file,
        };
      });
    } catch (error) {
      throw new Error('Error creating customer: ' + error.message);
    }
  }
  
  

async findAll(search?: string): Promise<Customer[]> {
  const where = search
    ? [
        { name: ILike(`%${search}%`) },
        { mobile: ILike(`%${search}%`) },
      ]
    : undefined;

  return this.customerRepo.find({
    where,
    relations: ['details', 'documents', 'devices', 'requests'],
  });
}


  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['details', 'documents', 'devices', 'requests'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: number, data: any) {
    return await this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOne(Customer, { where: { id } });
      if (!customer) throw new Error('Customer not found');
  
      Object.assign(customer, {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        age: data.age,
        status: data.status,
      });
      await manager.save(customer);
  
      const details = await manager.findOne(CustomerDetails, {
        where: { customer_id: id },
      });
      if (details) {
        Object.assign(details, data.details);
        await manager.save(details);
      }
  
      const documents = await manager.findOne(CustomerDocuments, {
        where: { customer_id: id },
      });
      if (documents) {
        Object.assign(documents, data.documents);
        if (data.upload_file) {
          documents.file_path = data.upload_file;
        }
        await manager.save(documents);
      }
  
      return { message: 'Customer updated successfully', customer_id: id };
    });
  }
  

  async remove(id: number) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['details', 'documents', 'devices', 'requests'],
    });
  
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  
    await this.dataSource.transaction(async (manager) => {
      if (customer.details) await manager.softRemove(customer.details);
      if (customer.documents) await manager.softRemove(customer.documents);
      if (customer.devices) await manager.softRemove(customer.devices);
      if (customer.requests) await manager.softRemove(customer.requests);
      await manager.softRemove(customer);
    });
  
    return { message: 'Customer and related data soft deleted successfully' };
  }
  
}


