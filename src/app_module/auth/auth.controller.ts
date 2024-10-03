import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LineUid } from './dto/line-uid.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/create-refresh.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() lineUid: LineUid) {
    const user = await this.authService.chackUser(lineUid);
    return user
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

}
