import { Module } from '@nestjs/common';
import { BindYourFortuneModule } from './bind-your-fortune/bind-your-fortune.module';

@Module({
  imports: [BindYourFortuneModule],
})
export class AppModule {}
