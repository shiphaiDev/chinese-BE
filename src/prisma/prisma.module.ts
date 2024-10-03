import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // ต้องแน่ใจว่าได้ export PrismaService ด้วย
})
export class PrismaModule {}
