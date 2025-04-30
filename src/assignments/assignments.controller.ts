import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentService: AssignmentsService) {}


  @Post('assignrequest')
  async createAssignment(@Body() body: {
    customer_id: number;
    vendor_id: number;
    service_id: number;
    sub_service_id: number;
  }) {
    return this.assignmentService.AssignmentRequest(body);
  }

  @Get('customers')
  getCustomerAssignments() {
    return this.assignmentService.getCustomerAssignments();
  }

  // Endpoint to get vendor assignments
  @Get('vendors')
  getVendorAssignments() {
    return this.assignmentService.getVendorAssignments();
  }
}







