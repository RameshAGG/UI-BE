import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerRequests } from "../entities/customer_requests.entity";
import { Customer } from "../entities/customer.entity";
import { VendorServices } from "../entities/vendor_services.entity";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(CustomerRequests)
    private customerRequestRepo: Repository<CustomerRequests>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(VendorServices)
    private vendorServiceRepo: Repository<VendorServices>,
  ) {}


  async AssignmentRequest(data: {
    customer_id: number;
    vendor_id: number;
    service_id: number;
    sub_service_id: number;
  }) {
    const newRequest = this.customerRequestRepo.create({
      customer_id: data.customer_id,
      vendor_id: data.vendor_id,
      service_id: data.service_id || 3,
      sub_service_id: data.sub_service_id || 3,
    });
  
    return await this.customerRequestRepo.save(newRequest);
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
  async getVendorAssignments() {
    const vendorServices = await this.vendorServiceRepo.find({
      relations: ['vendor'],  // Fetch related vendor data
      order: { id: 'ASC' },
    });

    return vendorServices.map((vs, index) => ({
      s_no: index + 1,
      id: vs.vendor?.id,
      vendor_name: vs.vendor?.name,
      care_category: vs.service_id,  // care_category refers to service_id
      date: vs.created_at,  // Using created_at as the date for assignment
      assign: true,
    }));
  }
}

