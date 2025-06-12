import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionItemService } from './suggestion-item.service';

describe('SuggestionItemService', () => {
  let service: SuggestionItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestionItemService],
    }).compile();

    service = module.get<SuggestionItemService>(SuggestionItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
