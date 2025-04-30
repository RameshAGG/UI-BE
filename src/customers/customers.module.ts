import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from '../entities/customer.entity'; 
import { CustomerDetails } from '../entities/customer_details.entity';
import { CustomerDocuments } from '../entities/customer_documents.entity';
import { CustomerDevices } from '../entities/customer_devices.entity';
import { CustomerRequests } from '../entities/customer_requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerDetails, CustomerDocuments, CustomerDevices, CustomerRequests])], 
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}

