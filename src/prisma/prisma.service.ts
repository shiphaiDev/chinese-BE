import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],  // เพิ่ม Logging
    });
  }

  async onModuleInit() {
    await this.runMigrations();
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async runMigrations() {
    // ใช้คำสั่ง Prisma migrate
    return new Promise<void>((resolve, reject) => {
      exec(`npx prisma migrate deploy`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Migration error: ${stderr}`);
          reject(error);
        } else {
          console.log(`Migration success: ${stdout}`);
          resolve();
        }
      });
    });
  }
}
