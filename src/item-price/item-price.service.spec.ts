import { Test, TestingModule } from '@nestjs/testing';
import { ItemPriceService } from './item-price.service';

describe('ItemPriceService', () => {
  let service: ItemPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemPriceService],
    }).compile();

    service = module.get<ItemPriceService>(ItemPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
