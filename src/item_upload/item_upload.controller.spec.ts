import { Test, TestingModule } from '@nestjs/testing';
import { ItemUploadController } from './item_upload.controller';

describe('ItemUploadController', () => {
  let controller: ItemUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemUploadController],
    }).compile();

    controller = module.get<ItemUploadController>(ItemUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
