import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BindYourFortuneService } from './bind-your-fortune.service';
import { CreateBindYourFortuneDto } from './dto/create-bind-your-fortune.dto';
import { UpdateBindYourFortuneDto } from './dto/update-bind-your-fortune.dto';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('bind-your-fortune')
export class BindYourFortuneController {
  constructor(private readonly bindYourFortuneService: BindYourFortuneService) {}

  @Post()
async  create(@Body() createBindYourFortuneDto : CreateBindYourFortuneDto ) {
    const bazi = await this.bindYourFortuneService.getBazi(createBindYourFortuneDto);
    const analysis = this.bindYourFortuneService.analyzeElements(bazi);

    return {
      bazi,
      analysis,
    };
  }

  // @Get()
  // findAll() {
  //   return this.bindYourFortuneService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bindYourFortuneService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBindYourFortuneDto: UpdateBindYourFortuneDto) {
  //   return this.bindYourFortuneService.update(+id, updateBindYourFortuneDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bindYourFortuneService.remove(+id);
  // }
}
