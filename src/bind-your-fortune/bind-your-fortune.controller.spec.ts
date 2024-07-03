import { Test, TestingModule } from '@nestjs/testing';
import { BindYourFortuneController } from './bind-your-fortune.controller';
import { BindYourFortuneService } from './bind-your-fortune.service';

describe('BindYourFortuneController', () => {
  let controller: BindYourFortuneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BindYourFortuneController],
      providers: [BindYourFortuneService],
    }).compile();

    controller = module.get<BindYourFortuneController>(BindYourFortuneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
