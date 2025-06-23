import { Test, TestingModule } from '@nestjs/testing';
import { SupplierUploadController } from './supplier-upload.controller';

describe('SupplierUploadController', () => {
  let controller: SupplierUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierUploadController],
    }).compile();

    controller = module.get<SupplierUploadController>(SupplierUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
