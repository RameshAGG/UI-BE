import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionItemController } from './suggestion-item.controller';

describe('SuggestionItemController', () => {
  let controller: SuggestionItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestionItemController],
    }).compile();

    controller = module.get<SuggestionItemController>(SuggestionItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
