import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRequests } from '../entities/customer_requests.entity';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerRequests])],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
