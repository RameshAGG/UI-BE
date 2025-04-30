import { Test, TestingModule } from '@nestjs/testing';
import { MasterService } from './submaster.service';

describe('MasterService', () => {
  let service: MasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterService],
    }).compile();

    service = module.get<MasterService>(MasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
