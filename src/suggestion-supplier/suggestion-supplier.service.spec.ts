import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionSupplierService } from './suggestion-supplier.service';

describe('SuggestionSupplierService', () => {
  let service: SuggestionSupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestionSupplierService],
    }).compile();

    service = module.get<SuggestionSupplierService>(SuggestionSupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
