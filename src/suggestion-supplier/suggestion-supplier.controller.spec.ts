import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionSupplierController } from './suggestion-supplier.controller';

describe('SuggestionSupplierController', () => {
  let controller: SuggestionSupplierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestionSupplierController],
    }).compile();

    controller = module.get<SuggestionSupplierController>(SuggestionSupplierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
