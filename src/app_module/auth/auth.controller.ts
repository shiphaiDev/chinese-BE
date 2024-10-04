import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LineUid } from './dto/line-uid.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/create-refresh.dto';
import { JwtAuthGuard } from './guard/auth.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() lineUid: LineUid) {
    const user = await this.authService.login(lineUid);
    return user
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

}
