import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment } from '../entities/assignment.entity';
import { Customer } from '../entities/customer.entity';
import { Vendor } from '../entities/vendor.entity';
import { CustomerRequests } from '../entities/customer_requests.entity';
import { VendorServices } from '../entities/vendor_services.entity';
import { ServiceMaster } from '../entities/service_master.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, Customer, Vendor, CustomerRequests, VendorServices, ServiceMaster])
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}


