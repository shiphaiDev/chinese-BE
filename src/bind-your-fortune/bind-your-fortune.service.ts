import { Injectable } from '@nestjs/common';
import { CreateBindYourFortuneDto } from './dto/create-bind-your-fortune.dto';
import * as dayjs from 'dayjs';
import { Lunar, I18n, EightChar, Solar } from 'lunar-javascript';
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
    // const lunar = Lunar.fromSolar(solar);
    // const eightChar = EightChar.fromLunar(lunar);

    const fullDateTime = dayjs(createBindYourFortuneDto.dateStr + ' ' + createBindYourFortuneDto.timeStr, 'YYYY-MM-DD HH:mm', true).toDate();

    const lunar = Lunar.fromDate(fullDateTime);
    const eightChar = lunar.getEightChar();

    // ปี 
    const indexYearGen = lunar.getYearGanIndex(); // สวรรค์
    const indexYearZhi = lunar.getYearZhiIndex(); // โลก
    // เดือน 
    const indexMonthGen = lunar.getMonthGanIndex(); // สวรรค์
    const indexMonthZhi = lunar.getMonthZhiIndex(); // โลก
    // วัน 
    const indexDayGen = lunar.getDayGanIndex(); // สวรรค์
    const indexDayZhi = lunar.getDayZhiIndex(); // โลก
    // เวลา 
    const indexTimeGen = lunar.getTimeGanIndex(); // สวรรค์
    const indexTimeZhi = lunar.getTimeZhiIndex(); // โลก

    //ธาตุุทั้ง 5
    const elementYear = this.elements(indexYearGen,indexYearZhi)
    const elementMonth = this.elements(indexMonthGen,indexMonthZhi)
    const elementDay = this.elements(indexDayGen,indexDayZhi)
    const elementTime = this.elements(indexTimeGen,indexTimeZhi)
    //สิบเทพ
    const tengodGan = lunar.getBaZiShiShenGan()

    const data  = {
      year : {
        gen : {
          indexYearGen : indexYearGen,
          Gan : eightChar.getYearGan(),
          YinYangGen: this.YinYang(indexYearGen),
          element : elementYear.gen,
          tengod : tengodGan[0]
        },
        zhi : {
          indexYearZhi : indexYearZhi,
          Zhi : eightChar.getYearZhi(),
          YinYangZhi: this.YinYang(indexYearZhi),
          element : elementYear.zhi,
          amnimal: lunar.getYearShengXiao(),
          tengod : eightChar.getYearShiShenZhi()
        },
        elements : eightChar.getYearWuXing(),
        changsheng : {
          Life : eightChar.getYearDiShi(),
        }
      },
      month: {
        gen : {
          indexMonthGen: indexMonthGen,
          Gan : eightChar.getMonthGan(),
          YinYangGen: this.YinYang(indexMonthGen),
          element : elementMonth.gen,
          tengod : tengodGan[1]
        },
        zhi : {
          indexMonthZhi : indexMonthZhi,
          Zhi : eightChar.getMonthZhi(),
          YinYangZhi: this.YinYang(indexMonthZhi),
          element : elementMonth.zhi,
          amnimal: lunar.getMonthShengXiao(),
          tengod : tengodGan[2]
        },
        elements : eightChar.getMonthWuXing(),
        changsheng : {
          Life : eightChar.getMonthDiShi(),
        }
      }, 
      day: {
        gen : {
          indexDayGen : indexDayGen,
          Gan : eightChar.getDayGan(),
          YinYangGen: this.YinYang(indexDayGen),
          element : elementDay.gen,
          tengod : tengodGan[2]
        },
        zhi : {
          indexDayZhi : indexDayZhi,
          Zhi : eightChar.getDayZhi(),
          YinYangZhi: this.YinYang(indexDayZhi),
          element : elementDay.zhi,
          amnimal: lunar.getDayShengXiao(),
          tengod : eightChar.getDayShiShenZhi()
        },
        elements : eightChar.getDayWuXing(),
        changsheng : {
          Life : eightChar.getDayDiShi(),
        }
      },
      time: {
        gen : {
          indexTimeGen : indexTimeGen,
          Gan : eightChar.getTimeGan(),
          YinYangGen: this.YinYang(indexTimeGen),
          element : elementTime.gen,
          tengod : tengodGan[3]
        },
        zhi : {
          indexTimeZhi : indexTimeZhi,
          Zhi : eightChar.getTimeZhi(),
          YinYangZhi: this.YinYang(indexTimeZhi),
          element : elementTime.zhi,
          amnimal: lunar.getTimeShengXiao(),
          tengod : eightChar.getTimeShiShenZhi()
        },
        elements : eightChar.getTimeWuXing(),
        changsheng : {
          Life : eightChar.getTimeDiShi(),
        }
      },
      
    }
    console.log(data)
    console.log(indexTimeZhi)
    console.log(indexDayZhi)
    return data
  }

  private YinYang(indexs : string){
      const yinYang = [
      'Yang',
      'Yin',
      'Yang',
      'Yin',
      'Yang',
      'Yin',
      'Yang',
      'Yin',
      'Yang',
      'Yin',
      'Yang',
      'Yin',
    ];

    const yinYangThai = {
      'Yang' : ['阳','Yang','ใหญ่'],
      'Yin' : ['阴','Yin','เล็ก']
    }
    return yinYangThai[yinYang[indexs]]
    // return yinYang[indexs];
  }

  private elements (indexGen? : string, indexZhi? : string) {
    const genelements = [
      'Wood',
      'Wood',
      'Fire',
      'Fire',
      'Earth',
      'Earth',
      'Metal',
      'Metal',
      'Water',
      'Water',
    ];
    const zhielements = [
      'Water',
      'Earth',
      'Wood',
      'Wood',
      'Earth',
      'Fire',
      'Fire',
      'Earth',
      'Metal',
      'Metal',
      'Earth',
      'Water',
    ];

    const elementThai = {
      //ไทย จีน อังกฤษ
      'Wood' : ['ไม้','木','Wood'],
      'Fire' : ['ไฟ','火','Fire'],
      'Earth' : ['ดิน','土','Earth'],
      'Metal' : ['โลหะ','金','Metal'],
      'Water' : ['น้ำ','水','Water'],   
    }
    const gen = elementThai[genelements[indexGen]];
    const zhi = elementThai[zhielements[indexZhi]];
    const data = {
      gen: gen,
      zhi: zhi,
    }
    return data
  }


}