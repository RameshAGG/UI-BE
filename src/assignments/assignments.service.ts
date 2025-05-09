import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerRequests } from "../entities/customer_requests.entity";
import { Customer } from "../entities/customer.entity";
import { VendorServices } from "../entities/vendor_services.entity";
import { ServiceMaster } from "../entities/service_master.entity";
import { Assignment } from "../entities/assignment.entity";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(CustomerRequests)
    private customerRequestRepo: Repository<CustomerRequests>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(VendorServices)
    private vendorServiceRepo: Repository<VendorServices>,

    @InjectRepository(ServiceMaster)
    private serviceMasterRepo: Repository<ServiceMaster>,

    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
  ) {}

  async AssignmentRequest(data: {
    customer_id: number;
    vendor_id: number;
    service_id: number;
    sub_service_id: number;
  }) {
    // Create customer request
    const newRequest = this.customerRequestRepo.create({
      customer_id: data.customer_id,
      vendor_id: data.vendor_id,
      service_id: data.service_id || 3,
      sub_service_id: data.sub_service_id || 3,
    });
    await this.customerRequestRepo.save(newRequest);

    // Get service name for care_category
    const service = await this.serviceMasterRepo.findOne({
      where: { id: data.service_id }
    });

    // Create assignment
    const newAssignment = this.assignmentRepo.create({
      customer_id: data.customer_id,
      vendor_id: data.vendor_id,
      care_category: service?.name || 'Default Service',
      care_type: 'Regular', // You can modify this based on your requirements
      request_date: new Date()
    });

    return await this.assignmentRepo.save(newAssignment);
  }
  

  // Method to fetch customer assignments
  async getCustomerAssignments() {
    const requests = await this.customerRequestRepo.find({
      relations: ['customer', 'service', 'subService'],  // Added service and subService relations
      order: { id: 'ASC' },
    });

    return requests.map((req, index) => ({
      s_no: index + 1,
      id: req.customer?.id,
      customer_name: req.customer?.name,
      service_id: req.service_id,
      service_name: req.service?.name,  // Added service name
      sub_service_id: req.sub_service_id,
      sub_service_name: req.subService?.name,  // Added sub-service name
      request_date: req.created_at,
      assign: true,
    }));
  }

  // Method to fetch vendor assignments
  async getVendorAssignments(id: number) {
    const vendorServices = await this.vendorServiceRepo.find({
      relations: ['vendor', 'service'],  // Added service relation
      order: { id: 'ASC' },
      where: { service_id: id },
    });

    return vendorServices.map((vs, index) => ({
      s_no: index + 1,
      id: vs.vendor?.id,
      vendor_name: vs.vendor?.name,
      care_category: vs.service_id, 
      service_name: vs.service?.name,
      date: vs.created_at,  
      assign: true,
    }));
  }
}

