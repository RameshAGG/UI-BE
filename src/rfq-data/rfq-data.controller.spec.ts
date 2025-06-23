import { Test, TestingModule } from '@nestjs/testing';
import { RfqDataController } from './rfq-data.controller';

describe('RfqDataController', () => {
  let controller: RfqDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RfqDataController],
    }).compile();

    controller = module.get<RfqDataController>(RfqDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
