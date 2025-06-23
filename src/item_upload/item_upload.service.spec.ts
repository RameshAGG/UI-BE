import { Test, TestingModule } from '@nestjs/testing';
import { ItemUploadService } from './item_upload.service';

describe('ItemUploadService', () => {
  let service: ItemUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemUploadService],
    }).compile();

    service = module.get<ItemUploadService>(ItemUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
