import { Controller } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/customer.entity';
import { BaseController } from '../common/base/base.controller';

@Controller('customers')
export class CustomersController extends BaseController<Customer> {
  constructor(private readonly customersService: CustomersService) {
    super(customersService);
  }
} 