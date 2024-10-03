import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty()
    firstname:     string

    @ApiProperty()
    lastname:      string

    @ApiProperty()
    year:          string
    
    @ApiProperty()
    mount:         string

    @ApiProperty()
    day:           string

    @ApiProperty()
    hrs:           string

    @ApiProperty()
    location:      string

    @ApiProperty()
    sex:           boolean
    
    @ApiProperty()
    line_uid:      string
}
