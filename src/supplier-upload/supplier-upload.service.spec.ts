import { Test, TestingModule } from '@nestjs/testing';
import { SupplierUploadService } from './supplier-upload.service';

describe('SupplierUploadService', () => {
  let service: SupplierUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierUploadService],
    }).compile();

    service = module.get<SupplierUploadService>(SupplierUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
