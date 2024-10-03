import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async chackUser(createAuthDto: CreateAuthDto) {
    const checkUid = await this.checkLineUid(createAuthDto.line_uid)
    if (checkUid) {
      throw new HttpException('พบข้อมูลอยู่ในระบบอยู่แล้ว',HttpStatus.ACCEPTED)
    } 
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

   async checkLineUid(Uid : string){
    const checkData = await this.prisma.lineuid.findUnique({
      where: {
        line_uid: Uid
      }
    })
    return checkData ? true : false
  }
}
