import { Test, TestingModule } from '@nestjs/testing';
import { ItemPriceUploadService } from './item-price-upload.service';

describe('ItemPriceUploadService', () => {
  let service: ItemPriceUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemPriceUploadService],
    }).compile();

    service = module.get<ItemPriceUploadService>(ItemPriceUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
