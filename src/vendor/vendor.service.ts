import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { VendorDetails } from '../entities/vendor_details.entity';
import { VendorServices } from '../entities/vendor_services.entity';
import { VendorDocuments } from '../entities/vendor_documents.entity';
import { Users } from '../entities/users.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(VendorDetails) private vendorDetailsRepo: Repository<VendorDetails>,
    @InjectRepository(VendorServices) private vendorServicesRepo: Repository<VendorServices>,
    @InjectRepository(VendorDocuments) private vendorDocumentsRepo: Repository<VendorDocuments>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async create(data: any) {
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    return await this.dataSource.transaction(async (manager) => {
      // Create vendor
      const vendor = manager.create(Vendor, {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        age: data.age,
        status: data.status,
        organization_id: data.organization_id || 1,
      });
      
      const savedVendor = await manager.save(vendor);

      // Get details from either details or vendorDetails
      const details = data.details || data.vendorDetails;
      if (!details) {
        throw new Error('Vendor details are required');
      }

      // Create vendor details
      const vendorDetails = manager.create(VendorDetails, {
        vendor_id: savedVendor.id,
        city: details.city,
        state: details.state,
        country: details.country,
        latitude: details.latitude,
        longitude: details.longitude,
        address: details.address,
        TFN_number: details.TFN_number,
        license: details.license,
        proof_of_age: details.proof_of_age,
        passport: details.passport
      });
      await manager.save(vendorDetails);

      // Create vendor documents
      const vendorDocuments = manager.create(VendorDocuments, {
        vendor_id: savedVendor.id,
        TFN: details.TFN_number,
        license: details.license,
        proof_of_age: details.proof_of_age,
        passport: details.passport
      });
      await manager.save(vendorDocuments);

      // Get services from either services or vendorServices
      const services = data.services || data.vendorServices;
      if (services) {
        // Convert single service object to array if needed
        const servicesArray = Array.isArray(services) ? services : [services];
        const vendorServices = servicesArray.map((service) =>
          manager.create(VendorServices, {
            vendor_id: savedVendor.id,
            service_id: service.service_id,
            sub_service_id: service.sub_service_id,
            created_by: data.created_by,
            updated_by: data.created_by,
          }),
        );
        await manager.save(vendorServices);
      }

      // Create user
      const user = manager.create(Users, {
        user_name: data.name,
        email: data.email,
        mobile_no: data.mobile,
        password: data.password || "123",
        organization_id: data.organization_id || 1,
      });
      await manager.save(user);

      return { message: 'Vendor created successfully', vendor_id: savedVendor.id };
    });
  }

  async findAll(search?: string) {
    let vendors: Vendor[];
  
    if (search) {
      vendors = await this.vendorRepo.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['vendorServices', 'vendorServices.service', 'vendorServices.subService'],
        withDeleted: false
      });
    } else {
      vendors = await this.vendorRepo.find({
        relations: ['vendorServices', 'vendorServices.service', 'vendorServices.subService'],
        withDeleted: false
      });
    }
  
    return vendors.flatMap(vendor =>
      vendor.vendorServices.map(service => ({
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        service_id: service.service_id,
        service_name: service.service?.name || null,
        sub_service_id: service.sub_service_id,
        sub_service_name: service.subService?.name || null,
        joining_date: vendor.createdAt,
      })),
    );
  }
  

  async findOne(id: number) {
    return this.vendorRepo.findOne({
      where: { id },
      relations: ['vendorDetails', 'vendorServices'],
    });
  }

  async update(id: number, data: any) {
    return this.dataSource.transaction(async (manager) => {
      // Check if vendor exists
      const vendor = await manager.findOne(Vendor, { where: { id } });
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      // Prepare vendor update data
      const vendorUpdateData: any = {};
      if (data.name) vendorUpdateData.name = data.name;
      if (data.email) vendorUpdateData.email = data.email;
      if (data.mobile) vendorUpdateData.mobile = data.mobile;
      if (data.age) vendorUpdateData.age = data.age;
      if (data.status) vendorUpdateData.status = data.status;
      if (data.organization_id) vendorUpdateData.organization_id = data.organization_id;

      // Only update vendor if there are changes
      if (Object.keys(vendorUpdateData).length > 0) {
        await manager.update(Vendor, id, vendorUpdateData);
      }

      // Get details from either details or vendorDetails
      const details = data.details || data.vendorDetails;
      if (details) {
        const detailsUpdateData: any = {};
        if (details.city) detailsUpdateData.city = details.city;
        if (details.state) detailsUpdateData.state = details.state;
        if (details.country) detailsUpdateData.country = details.country;
        if (details.latitude) detailsUpdateData.latitude = details.latitude;
        if (details.longitude) detailsUpdateData.longitude = details.longitude;
        if (details.address) detailsUpdateData.address = details.address;
        if (details.TFN_number) detailsUpdateData.TFN_number = details.TFN_number;
        if (details.license) detailsUpdateData.license = details.license;
        if (details.proof_of_age) detailsUpdateData.proof_of_age = details.proof_of_age;
        if (details.passport) detailsUpdateData.passport = details.passport;

        // Only update details if there are changes
        if (Object.keys(detailsUpdateData).length > 0) {
          await manager.update(VendorDetails, { vendor_id: id }, detailsUpdateData);

          // Update vendor documents if TFN, license, proof_of_age, or passport changed
          const documentsUpdateData: any = {};
          if (details.TFN_number) documentsUpdateData.TFN = details.TFN_number;
          if (details.license) documentsUpdateData.license = details.license;
          if (details.proof_of_age) documentsUpdateData.proof_of_age = details.proof_of_age;
          if (details.passport) documentsUpdateData.passport = details.passport;

          if (Object.keys(documentsUpdateData).length > 0) {
            await manager.update(VendorDocuments, { vendor_id: id }, documentsUpdateData);
          }
        }
      }

      // Get services from either services or vendorServices
      const services = data.services || data.vendorServices;
      if (services) {
        // Delete existing services
        await manager.delete(VendorServices, { vendor_id: id });
        
        // Convert single service object to array if needed
        const servicesArray = Array.isArray(services) ? services : [services];
        if (servicesArray.length > 0) {
          const newServices = servicesArray.map((service) =>
            manager.create(VendorServices, {
              vendor_id: id,
              service_id: service.service_id,
              sub_service_id: service.sub_service_id,
              created_by: data.updated_by,
              updated_by: data.updated_by,
            }),
          );
          await manager.save(newServices);
        }
      }

      return { message: 'Vendor updated successfully' };
    });
  }

  async remove(id: number) {
    return this.dataSource.transaction(async (manager) => {
      // Check if vendor exists
      const vendor = await manager.findOne(Vendor, { 
        where: { id },
        relations: ['vendorDetails', 'vendorServices']
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      // Delete vendor services
      await manager.delete(VendorServices, { vendor_id: id });

      // Delete vendor details
      await manager.delete(VendorDetails, { vendor_id: id });

      // Delete vendor documents
      await manager.delete(VendorDocuments, { vendor_id: id });

      // Delete vendor
      await manager.delete(Vendor, { id });

      return { message: 'Vendor and related data deleted successfully' };
    });
  }
}
