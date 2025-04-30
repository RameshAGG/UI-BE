import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubServiceMaster } from '../entities/sub_service_master.entity';
import { SubServiceMasterService } from './submaster.service';
import { SubServiceMasterController } from './submaster.controller';
import { ServiceMaster } from '../entities/service_master.entity'; // adjust the import path accordingly

@Module({
  imports: [TypeOrmModule.forFeature([SubServiceMaster, ServiceMaster])],
  providers: [SubServiceMasterService],
  controllers: [SubServiceMasterController],
})
export class SubServiceMasterModule {}
