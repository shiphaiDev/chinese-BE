import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.authService.checkLineUid(
      createUserDto.line_uid,
    );
    if (checkUser) {
      throw new HttpException(
        'พบข้อมูลอยู่ในระบบอยู่แล้ว',
        HttpStatus.ACCEPTED,
      );
    }
    const data = await this.prisma.user.create({
      data: {
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        year: createUserDto.year,
        mount: createUserDto.mount,
        day: createUserDto.day,
        hrs: createUserDto.hrs,
        location: createUserDto.location,
        sex: createUserDto.sex,
        lineuid: {
          create: {
            line_uid: createUserDto.line_uid,
          },
        },
      },
      include: {
        lineuid: true,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
