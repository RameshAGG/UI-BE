import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../entities/vendor.entity';
import { VendorDetails } from '../entities/vendor_details.entity';
import { VendorServices } from '../entities/vendor_services.entity';
import { Users } from '../entities/users.entity';
import { VendorsService } from './vendor.service';
import { VendorsController } from './vendor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, VendorDetails, VendorServices, Users])],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}

