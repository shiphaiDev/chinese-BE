import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    const newLog = await this.prisma.log.create({
      data
    });
    return newLog;
  }
}
