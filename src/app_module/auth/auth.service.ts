import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LineUid } from './dto/line-uid.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/create-refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async chackUser(lineUid: LineUid) {
    const checkUid = await this.checkLineUid(lineUid.line_uid);
    if (checkUid) {
      const token = await this.genToken(lineUid.line_uid)
      return token
    }
    throw new HttpException('ไม่พบผู้ใช้',HttpStatus.NOT_FOUND)

    
  }

  async checkLineUid(Uid: string) {
    const checkData = await this.prisma.lineuid.findUnique({
      where: {
        line_uid: Uid,
      },
    });
    return checkData ? true : false;
  }

  async genToken(line_uid) {
    const payload = {
      sub: line_uid,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    });

    return {
      access_token: this.jwtService.sign(payload),
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // สร้าง Access Token ใหม่จากข้อมูลของ Refresh Token
      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
        }
      );
      const refreshToken = this.jwtService.sign(
        {
          sub: payload.sub,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
        },
      );
      return {
        access_token: newAccessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

}
