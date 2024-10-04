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
        HttpStatus.CONFLICT,
      );
    }
    try {
      // Create new user in the database
      const newUser = await this.prisma.user.create({
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

      // Generate token if user creation is successful
      const token = await this.authService.genToken(newUser.lineuid.line_uid);
      return { token, user: newUser };
    } catch (error) {
      throw new HttpException('เกิดข้อผิดพลาด ไม่สามารถลงทะเบียนได้', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 async getUser(id: number) {
  const data = await this.prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      firstname: true,
      lastname: true,
      year: true,
      mount: true,
      day: true,
      hrs: true,
      location: true,
      sex: true,
    }
  })
    return data ;
  }

}
