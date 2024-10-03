import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto  {

    @ApiProperty()
    @IsNotEmpty({message : "ห้ามมีค่าว่าง"})
    @IsString({message : "ตัวอักษรเท่านั้น"})
    refreshToken: string
}
