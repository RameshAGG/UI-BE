import { Test, TestingModule } from '@nestjs/testing';
import { ItemPriceController } from './item-price.controller';

describe('ItemPriceController', () => {
  let controller: ItemPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemPriceController],
    }).compile();

    controller = module.get<ItemPriceController>(ItemPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
