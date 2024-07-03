import { Test, TestingModule } from '@nestjs/testing';
import { BindYourFortuneService } from './bind-your-fortune.service';

describe('BindYourFortuneService', () => {
  let service: BindYourFortuneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BindYourFortuneService],
    }).compile();

    service = module.get<BindYourFortuneService>(BindYourFortuneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
