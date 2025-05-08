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
    return await this.dataSource.transaction(async (manager) => {
      const vendor = manager.create(Vendor, {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        age: data.age,
        status: data.status,
        organization_id: data.organization_id || 1,
      });
      
      const savedVendor = await manager.save(vendor);

      const vendorDetails = manager.create(VendorDetails, {
        ...data.details,
        vendor_id: savedVendor.id,
      });
      await manager.save(vendorDetails);

      if (data.documents) {
        const vendorDocuments = manager.create(VendorDocuments, {
          ...data.documents,
          vendor_id: savedVendor.id,
        });
        await manager.save(vendorDocuments);
      }

      if (data.services) {
        const vendorServices = data.services.map((service) =>
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
      });
    } else {
      vendors = await this.vendorRepo.find({
        relations: ['vendorServices', 'vendorServices.service', 'vendorServices.subService'],
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
      await manager.update(Vendor, id, data);

      if (data.details) {
        await manager.update(VendorDetails, { vendor_id: id }, data.details);
      }

      if (data.services) {
        await manager.delete(VendorServices, { vendor_id: id });
        const newServices = data.services.map((service) =>
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

      return { message: 'Vendor updated successfully' };
    });
  }

  async remove(id: number) {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['vendorDetails', 'vendorServices'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(VendorServices, { vendor_id: id });
      await manager.delete(VendorDetails, { vendor_id: id });
      await manager.delete(Vendor, { id });
      await manager.softRemove(vendor);
    });

    return { message: 'Vendor and related data soft deleted successfully' };
  }
}
