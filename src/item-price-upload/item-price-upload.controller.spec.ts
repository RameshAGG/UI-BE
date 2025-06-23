import { Test, TestingModule } from '@nestjs/testing';
import { ItemPriceUploadController } from './item-price-upload.controller';

describe('ItemPriceUploadController', () => {
  let controller: ItemPriceUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemPriceUploadController],
    }).compile();

    controller = module.get<ItemPriceUploadController>(ItemPriceUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
