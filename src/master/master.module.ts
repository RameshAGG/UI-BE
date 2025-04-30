import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { ServiceMaster } from '../entities/service_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [MasterService],
  controllers: [MasterController],
  imports: [TypeOrmModule.forFeature([ServiceMaster])],
})
export class MasterModule {}
