import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from 'src/log/log.service';
// import { JwtService } from '@nestjs/jwt';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private readonly logger = new Logger('HTTP');

  constructor(private readonly logService: LogService,
    // private jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const startTime = Date.now();
    // const token = await this.extractTokenFromHeader(req)
    // const adminId = await this.seetokenid(token)
    // console.log(`middle : ${adminId ? adminId : 0}`)
    // console.log(`Request from IP: ${ip}`);

    // ตรวจสอบและแปลงค่า ip ให้เป็น string
    if (Array.isArray(ip)) {
      ip = ip.join(', ');
    }
    res.on('finish', async () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || '0';
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const log = {
        // adminId : adminId ? adminId : 0,
        userId : 0,
        method,
        url: originalUrl,
        statusCode,
        contentLength,
        userAgent,
        ip,
        responseTime,
      };

      await this.logService.create(log);

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${responseTime}ms`,
      );
    });

    next();
  }

  // private extractTokenFromHeader(request: any): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }
  // private async seetokenid(token : string) {
  //   if (token) {
  //     const payload = await this.jwtService.verifyAsync(
  //       token,
  //       {
  //         secret: process.env.JWT_SECRET,
  //       },
  //     );
  //     // console.log(payload)
  //    const adminId = payload.sub
  //    return adminId
  //   }
  // }
}
