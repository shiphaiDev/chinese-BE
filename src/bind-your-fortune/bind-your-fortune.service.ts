import { Injectable } from '@nestjs/common';
import { CreateBindYourFortuneDto } from './dto/create-bind-your-fortune.dto';
import * as dayjs from 'dayjs';
import { Lunar, I18n } from 'lunar-javascript';
I18n.setLanguage('en');
@Injectable()
export class BindYourFortuneService {
  getBazi(createBindYourFortuneDto: CreateBindYourFortuneDto): any {
    // const solar = Solar.fromYmdHms(
    //   Number(createBindYourFortuneDto.dateStr.substring(0, 4)),
    //   Number(createBindYourFortuneDto.dateStr.substring(5, 7)),
    //   Number(createBindYourFortuneDto.dateStr.substring(8, 10)),
    //   Number(createBindYourFortuneDto.timeStr.substring(0, 2)),
    //   Number(createBindYourFortuneDto.timeStr.substring(3, 5)),
    //   0
    // );
    const fullDateTime = dayjs(createBindYourFortuneDto.dateStr + ' ' + createBindYourFortuneDto.timeStr, 'YYYY-MM-DD HH:mm', true).toDate();
    const lunar = Lunar.fromDate(fullDateTime);
    const eightChar = lunar.getEightChar();
    const data  = {
      year : {
        Xun : eightChar.getYearXun(),
        WuXing: eightChar.getYearWuXing(),
        amnimal: eightChar.getYearDiShi(),
      },
      month: {
        Xun : eightChar.getMonthXun(),
        WuXing: eightChar.getMonthWuXing(),
        amnimal: eightChar.getMonthDiShi(),
      }, 
      day: {
        Xun : eightChar.getDayXun(),
        WuXing: eightChar.getDayWuXing(),
        amnimal: eightChar.getDayDiShi(),
      },
      time: {
        Xun : eightChar.getTimeXun(),
        WuXing: eightChar.getTimeWuXing(),
        amnimal: eightChar.getTimeDiShi(),
      } 
      
    }
    console.log(data)
    return data
  }
}