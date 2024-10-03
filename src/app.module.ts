import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BindYourFortuneModule } from './bind-your-fortune/bind-your-fortune.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './app_module/auth/auth.module';
import { UserModule } from './app_module/user/user.module';
import { LogService } from './log/log.service';
import { LogModule } from './log/log.module';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [BindYourFortuneModule, PrismaModule, AuthModule, UserModule, LogModule],
  providers: [LogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // ใช้ Middleware กับทุกเส้นทาง
  }
}


