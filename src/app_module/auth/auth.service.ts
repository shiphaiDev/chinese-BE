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

  async login(lineUid: LineUid) {
    try {
      const checkUid = await this.checkLineUid(lineUid.line_uid);
      if (!checkUid) {
       return {
        isPaired : false
       }
      }
      const token = await this.genToken(lineUid.line_uid);
      return {
        token,
        isPaired : true
      }
    } catch (error) {
      this.handleException(error);
    }
  }

  async checkLineUid(Uid: string) {
    try {
      const checkData = await this.prisma.lineuid.findUnique({
        where: {
          line_uid: Uid,
        },
      });
      return checkData ? true : false;
    } catch (error) {
      this.handleException(error);
    }
  }

  async genToken(line_uid: string) {
    try {
      const dataUser = await this.prisma.lineuid.findUnique({
        where: {
          line_uid: line_uid,
        },
        select: {
          line_uid: true,
          user:  {
            select: {
              id: true,
            }
          }
        }
      })
      const payload = {
        sub: dataUser.user.id,
        line_uid: dataUser.line_uid
      };
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      });

      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: refreshToken,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
      });
      const newRefreshToken = this.jwtService.sign({
        sub: payload.sub,
      }, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      });
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
