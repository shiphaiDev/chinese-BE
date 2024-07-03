import { Injectable } from '@nestjs/common';
import { CreateBindYourFortuneDto } from './dto/create-bind-your-fortune.dto';
import { UpdateBindYourFortuneDto } from './dto/update-bind-your-fortune.dto';
import * as dayjs from 'dayjs'
import { Lunar } from 'lunar-javascript';
const getCZ = require('chinese-zodiac');

const heavenlyStems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
const earthlyBranches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
const yinYang = ['Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin'];
const hiddenStems = {
  'Zi': ['Gui'],
  'Chou': ['Ji', 'Gui', 'Xin'],
  'Yin': ['Jia', 'Bing', 'Wu'],
  'Mao': ['Yi'],
  'Chen': ['Wu', 'Yi', 'Gui'],
  'Si': ['Bing', 'Wu', 'Geng'],
  'Wu': ['Ding', 'Ji'],
  'Wei': ['Ji', 'Yi', 'Ding'],
  'Shen': ['Geng', 'Ren', 'Wu'],
  'You': ['Xin'],
  'Xu': ['Wu', 'Xin', 'Ren'],
  'Hai': ['Ren', 'Jia']
};

@Injectable()
export class BindYourFortuneService {

  // getLunarDate(date: Date): string {
  //   const lunar = Lunar.solarToLunar(date);
  //   return lunar
  // }

  // getZodiacSign(year: number): any {
  //   return getCZ(year);
  // }

//   getHoroscope(date: Date): string {
//     const year = date.getFullYear();
//     console.log(year)
//     const zodiacSign = this.getZodiacSign(year);
//     console.log(zodiacSign)
//     const horoscopes = {
//       'Rat': 'คุณจะมีโอกาสใหม่ๆ ในปีนี้',
//       'Ox': 'ปีนี้จะเป็นปีที่ดีสำหรับการลงทุน',
//       'Tiger': 'ระวังปัญหาสุขภาพ',
//       'Rabbit': 'ความสัมพันธ์จะดีขึ้น',
//       'Dragon': 'ปีนี้จะเป็นปีแห่งความสำเร็จ',
//       'Snake': 'มีโชคลาภเรื่องการเงิน',
//       'Horse': 'การงานจะก้าวหน้า',
//       'Goat': 'จะได้รับการสนับสนุนจากผู้ใหญ่',
//       'Monkey': 'ระวังเรื่องความขัดแย้ง',
//       'Rooster': 'มีโอกาสในการเดินทาง',
//       'Dog': 'จะพบกับความมั่นคง',
//       'Pig': 'ปีนี้จะเป็นปีที่มีความสุข',
//     };
// console.log(horoscopes[zodiacs[(year - 4) % 12]])
//     return horoscopes[zodiacs[(year - 4) % 12]] || 'ไม่มีคำทำนายสำหรับราศีนี้';
//   }

  getBazi(createBindYourFortuneDto : CreateBindYourFortuneDto): any {

    // ผสานวันที่และเวลาเป็นหนึ่งเดียว
    const fullDateTime = dayjs(`${createBindYourFortuneDto.dateStr} ${createBindYourFortuneDto.timeStr}`, 'YYYY-MM-DD HH:mm', true).toDate();

    // Convert to Lunar date
    const lunarDate = Lunar.fromDate(fullDateTime);
    console.log(lunarDate)
    const year = lunarDate.getYear();
    const month = lunarDate.getMonth();
    const day = lunarDate.getDay();
    const hour = fullDateTime.getHours();

    const yearStemIndex = lunarDate.getYearGanIndex();
    const yearBranchIndex = lunarDate.getYearZhiIndex();
    const yearStem = heavenlyStems[yearStemIndex];
    const yearBranch = earthlyBranches[yearBranchIndex];
    const yearElement = elements[yearStemIndex];
    const yearYinYang = yinYang[yearStemIndex];
    const yearBranchYinYang = yinYang[yearBranchIndex];

    const monthStemIndex = lunarDate.getMonthGanIndex();
    const monthBranchIndex = lunarDate.getMonthZhiIndex();
    const monthStem = heavenlyStems[monthStemIndex];
    const monthBranch = earthlyBranches[monthBranchIndex];
    const monthElement = elements[monthStemIndex];
    const monthYinYang = yinYang[monthStemIndex];
    const monthBranchYinYang = yinYang[monthBranchIndex];

    const dayStemIndex = lunarDate.getDayGanIndex();
    const dayBranchIndex = lunarDate.getDayZhiIndex();
    const dayStem = heavenlyStems[dayStemIndex];
    const dayBranch = earthlyBranches[dayBranchIndex];
    const dayElement = elements[dayStemIndex];
    const dayYinYang = yinYang[dayStemIndex];
    const dayBranchYinYang = yinYang[dayBranchIndex];

    const hourStemIndex = lunarDate.getTimeGanIndex();
    const hourBranchIndex = lunarDate.getTimeZhiIndex();
    const hourStem = heavenlyStems[hourStemIndex];
    const hourBranch = earthlyBranches[hourBranchIndex];
    const hourElement = elements[hourStemIndex];
    const hourYinYang = yinYang[hourStemIndex];
    const hourBranchYinYang = yinYang[hourBranchIndex];

    const yearZodiac = lunarDate.getAnimal();
    const hourZodiac = lunarDate.getAnimal(hourBranchIndex); // ใช้ฟังก์ชัน getAnimal

 // คำนวณ Life Stem และ ChangSheng สำหรับชม., วัน, เดือน, ปี
 const lifeStemHour = hourStem;
 const changShengHour = this.calculateChangSheng(hourStemIndex);
 const lifeStemDay = dayStem;
 const changShengDay = this.calculateChangSheng(dayStemIndex);
 const lifeStemMonth = monthStem;
 const changShengMonth = this.calculateChangSheng(monthStemIndex);
 const lifeStemYear = yearStem;
 const changShengYear = this.calculateChangSheng(yearStemIndex);

    return {
      year: { stem: yearStem, branch: yearBranch, element: yearElement, yinYang: yearYinYang, branchYinYang: yearBranchYinYang, hiddenStems: hiddenStems[yearBranch], zodiac: yearZodiac },
      month: { stem: monthStem, branch: monthBranch, element: monthElement, yinYang: monthYinYang, branchYinYang: monthBranchYinYang, hiddenStems: hiddenStems[monthBranch] },
      day: { stem: dayStem, branch: dayBranch, element: dayElement, yinYang: dayYinYang, branchYinYang: dayBranchYinYang, hiddenStems: hiddenStems[dayBranch] },
      hour: { stem: hourStem, branch: hourBranch, element: hourElement, yinYang: hourYinYang, branchYinYang: hourBranchYinYang, hiddenStems: hiddenStems[hourBranch], zodiac: hourZodiac },
      lifeStemHour: lifeStemHour,
      changShengHour: changShengHour,
      lifeStemDay: lifeStemDay,
      changShengDay: changShengDay,
      lifeStemMonth: lifeStemMonth,
      changShengMonth: changShengMonth,
      lifeStemYear: lifeStemYear,
      changShengYear: changShengYear,
    };
  }

  calculateChangSheng(stemIndex: number): string {
    // สมมติว่ามีการคำนวณ ChangSheng สำหรับ Stem ที่กำหนด
    const changShengMap = {
      0: 'GuanDai', 1: 'GuanDai', 2: 'Jue', 3: 'Jue', 4: 'LinGuan', 
      5: 'LinGuan', 6: 'DiWang', 7: 'DiWang', 8: 'Mu', 9: 'Mu'
    };
    return changShengMap[stemIndex] || 'Unknown';
  }

  calculatePillarChangSheng(stemIndex: number): string {
    // สมมติว่ามีการคำนวณ Pillar ChangSheng สำหรับ Stem ที่กำหนด
    const pillarChangShengMap = {
      0: 'Yang', 1: 'Yang', 2: 'Jue', 3: 'Jue', 4: 'Bing', 
      5: 'Bing', 6: 'Si', 7: 'Si', 8: 'Sheng', 9: 'Sheng'
    };
    return pillarChangShengMap[stemIndex] || 'Unknown';
  }

  analyzeElements(bazi: any): any {
    const elementCount = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

    [bazi.year, bazi.month, bazi.day, bazi.hour].forEach(pillar => {
      elementCount[pillar.element]++;
      pillar.hiddenStems.forEach(stem => {
        const elementIndex = heavenlyStems.indexOf(stem);
        if (elementIndex >= 0) {
          elementCount[elements[elementIndex]]++;
        }
      });
    });

    const minElement = Object.keys(elementCount).reduce((a, b) => elementCount[a] < elementCount[b] ? a : b);
    const maxElement = Object.keys(elementCount).reduce((a, b) => elementCount[a] > elementCount[b] ? a : b);

    return {
      elementCount,
      weakestElement: minElement,
      strongestElement: maxElement,
    };
  }

  // async predictBazi(dateStr: string, timeStr: string, years: number): Promise<any[]> {
  //   const results = [];
  //   const initialDate = dayjs(dateStr, 'YYYY-MM-DD', true);

  //   if (!initialDate.isValid()) {
  //     throw new Error('Invalid Date');
  //   }
    
  //   for (let i = -years; i <= years; i++) {
  //     const newDate = initialDate.add(i, 'year').format('YYYY-MM-DD');
  //     const bazi = this.getBazi(newDate, timeStr);
  //     const analysis = this.analyzeElements(bazi);
  //     results.push({
  //       date: newDate,
  //       bazi,
  //       analysis,
  //     });
  //   }

  //   return results;
  // }
}

