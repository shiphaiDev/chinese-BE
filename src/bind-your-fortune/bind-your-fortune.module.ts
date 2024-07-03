import { Module } from '@nestjs/common';
import { BindYourFortuneService } from './bind-your-fortune.service';
import { BindYourFortuneController } from './bind-your-fortune.controller';

@Module({
  controllers: [BindYourFortuneController],
  providers: [BindYourFortuneService],
})
export class BindYourFortuneModule {}
