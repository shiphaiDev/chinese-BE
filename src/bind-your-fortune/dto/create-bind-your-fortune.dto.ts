import { ApiProperty } from "@nestjs/swagger"

export class CreateBindYourFortuneDto {
    @ApiProperty()
    dateStr: string 

    @ApiProperty()
    timeStr: string
}
