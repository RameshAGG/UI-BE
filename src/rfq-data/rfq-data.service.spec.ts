import { Test, TestingModule } from '@nestjs/testing';
import { RfqDataService } from './rfq-data.service';

describe('RfqDataService', () => {
  let service: RfqDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfqDataService],
    }).compile();

    service = module.get<RfqDataService>(RfqDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
