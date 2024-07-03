import { Injectable } from '@nestjs/common';
import { CreateBindYourFortuneDto } from './dto/create-bind-your-fortune.dto';
import { UpdateBindYourFortuneDto } from './dto/update-bind-your-fortune.dto';
import * as dayjs from 'dayjs';
import { Lunar, LunarUtil } from 'lunar-javascript';
const getCZ = require('chinese-zodiac');

const heavenlyStems = [
  'Jia',
  'Yi',
  'Bing',
  'Ding',
  'Wu',
  'Ji',
  'Geng',
  'Xin',
  'Ren',
  'Gui',
];
const heavenlyelements = [
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
const heavenlyyinYang = [
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
const earthlyBranches = [
  'Zi',
  'Chou',
  'Yin',
  'Mao',
  'Chen',
  'Si',
  'Wu',
  'Wei',
  'Shen',
  'You',
  'Xu',
  'Hai',
];

const earthlyyinYang = [
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

const earthlyelements = [
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
const hiddenStems = {
  Zi: ['Gui'],
  Chou: ['Ji', 'Gui', 'Xin'],
  Yin: ['Jia', 'Bing', 'Wu'],
  Mao: ['Yi'],
  Chen: ['Wu', 'Yi', 'Gui'],
  Si: ['Bing', 'Wu', 'Geng'],
  Wu: ['Ding', 'Ji'],
  Wei: ['Ji', 'Yi', 'Ding'],
  Shen: ['Geng', 'Ren', 'Wu'],
  You: ['Xin'],
  Xu: ['Wu', 'Xin', 'Ren'],
  Hai: ['Ren', 'Jia'],
};



const zodiacSigns = {
  '鼠': {
    thai: 'ปีชวด (หนู)',
    english: 'Year of the Rat',
    chinese: '鼠 (shŭ / สู่)'
  },
  '牛': {
    thai: 'ปีฉลู (วัว)',
    english: 'Year of the Ox / Year of the Cow',
    chinese: '牛 (niú / หนิว)'
  },
  '虎': {
    thai: 'ปีขาล (เสือ)',
    english: 'Year of the Tiger',
    chinese: '虎 (hǔ / หู่)'
  },
  '兔': {
    thai: 'ปีเถาะ (กระต่าย)',
    english: 'Year of the Rabbit',
    chinese: '兔 (tù / ทู่)'
  },
  '龙': {
    thai: 'ปีมะโรง (งูใหญ่ / มังกร)',
    english: 'Year of the Dragon',
    chinese: '龙 (lóng / หลง)'
  },
  '蛇': {
    thai: 'ปีมะเส็ง (งูเล็ก)',
    english: 'Year of the Snake',
    chinese: '蛇 (shé / เสอ)'
  },
  '马': {
    thai: 'ปีมะเมีย (ม้า)',
    english: 'Year of the Horse',
    chinese: '马 (mǎ / หม่า)'
  },
  '羊': {
    thai: 'ปีมะแม (แพะ)',
    english: 'Year of the Goat',
    chinese: '羊 (yáng / หย่าง)'
  },
  '猴': {
    thai: 'ปีวอก (ลิง)',
    english: 'Year of the Monkey',
    chinese: '猴 (hóu / โหว)'
  },
  '鸡': {
    thai: 'ปีระกา (ไก่)',
    english: 'Year of the Rooster',
    chinese: '鸡 (jī / จี)'
  },
  '狗': {
    thai: 'ปีจอ (สุนัข)',
    english: 'Year of the Dog',
    chinese: '狗 (gǒu / โก่ว)'
  },
  '猪': {
    thai: 'ปีกุน (หมู)',
    english: 'Year of the Pig',
    chinese: '猪 (zhū / จู)'
  }
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

  getBazi(createBindYourFortuneDto: CreateBindYourFortuneDto): any {
    // ผสานวันที่และเวลาเป็นหนึ่งเดียว
    const fullDateTime = dayjs(
      `${createBindYourFortuneDto.dateStr} ${createBindYourFortuneDto.timeStr}`,
      'YYYY-MM-DD HH:mm',
      true,
    ).toDate();

    // Convert to Lunar date
    const lunarDate = Lunar.fromDate(fullDateTime);
    console.log(lunarDate);
    const year = lunarDate.getYear();
    const month = lunarDate.getMonth();
    const day = lunarDate.getDay();
    const hour = fullDateTime.getHours();

    const yearStemIndex = lunarDate.getYearGanIndex();
    const yearBranchIndex = lunarDate.getYearZhiIndex();
    const yearStem = heavenlyStems[yearStemIndex];
    const yearBranch = earthlyBranches[yearBranchIndex];
    const yearElement = heavenlyelements[yearStemIndex];
    const yearYinYang = heavenlyyinYang[yearStemIndex];
    const yearBranchYinYang = earthlyyinYang[yearBranchIndex];
    const yearBranchElement = earthlyelements[yearBranchIndex];

    const monthStemIndex = lunarDate.getMonthGanIndex();
    const monthBranchIndex = lunarDate.getMonthZhiIndex();
    const monthStem = heavenlyStems[monthStemIndex];
    const monthBranch = earthlyBranches[monthBranchIndex];
    const monthElement = heavenlyelements[monthStemIndex];
    const monthYinYang = heavenlyyinYang[monthStemIndex];
    const monthBranchYinYang = earthlyyinYang[monthBranchIndex];
    const monthBranchElement = earthlyelements[monthBranchIndex];

    const dayStemIndex = lunarDate.getDayGanIndex();
    const dayBranchIndex = lunarDate.getDayZhiIndex();
    const dayStem = heavenlyStems[dayStemIndex];
    const dayBranch = earthlyBranches[dayBranchIndex];
    const dayElement = heavenlyelements[dayStemIndex];
    const dayYinYang = heavenlyyinYang[dayStemIndex];
    const dayBranchYinYang = earthlyyinYang[dayBranchIndex];
    const dayBranchElement = earthlyelements[dayBranchIndex];

    const hourStemIndex = lunarDate.getTimeGanIndex();
    const hourBranchIndex = lunarDate.getTimeZhiIndex();
    const hourStem = heavenlyStems[hourStemIndex];
    const hourBranch = earthlyBranches[hourBranchIndex];
    const hourElement = heavenlyelements[hourStemIndex];
    const hourYinYang = heavenlyyinYang[hourStemIndex];
    const hourBranchYinYang = earthlyyinYang[hourBranchIndex];
    const hourBranchElement = earthlyelements[hourBranchIndex];

    const yearZodiac = zodiacSigns[lunarDate.getYearShengXiao()];
    const monthZodiac = zodiacSigns[lunarDate.getMonthShengXiao()];
    const dayZodiac = zodiacSigns[lunarDate.getDayShengXiao()];
    const hourZodiac = zodiacSigns[lunarDate.getTimeShengXiao()]; // ใช้ฟังก์ชัน getAnimal
    // const yearZodiac = getCZ(yearBranchIndex);
    // const monthZodiac = getCZ(monthBranchIndex);
    // const dayZodiac = getCZ(dayBranchIndex);
    // const hourZodiac = getCZ(hourBranchIndex); // ใช้ฟังก์ชัน getAnimal
    console.log(yearZodiac)
    console.log(monthZodiac)
    console.log(dayZodiac)
    console.log(hourZodiac)
    

    // คำนวณ Life Stem และ ChangSheng สำหรับชม., วัน, เดือน, ปี
    const changShengHour = this.calculateChangSheng(hourStemIndex);
    const changShengDay = this.calculateChangSheng(dayStemIndex);
    const changShengMonth = this.calculateChangSheng(monthStemIndex);
    const changShengYear = this.calculateChangSheng(yearStemIndex);

    const pillarchangshengHour = this.calculatePillarChangSheng(hourStemIndex);
    const pillarchangshengDay = this.calculatePillarChangSheng(dayStemIndex);
    const pillarchangshengMonth = this.calculatePillarChangSheng(monthStemIndex);
    const pillarchangshengYear = this.calculatePillarChangSheng(yearStemIndex);

    return {
      year: {
        stem: yearStem,
        branch: yearBranch,
        heavenlyelement: yearElement,
        heavenlyyinYang: yearYinYang,
        branchYinYang: yearBranchYinYang,
        branchelement: yearBranchElement,
        hiddenStems: hiddenStems[yearBranch],
        zodiac: yearZodiac,
      },
      month: {
        stem: monthStem,
        branch: monthBranch,
        heavenlyelement: monthElement,
        heavenlyyinYang: monthYinYang,
        branchYinYang: monthBranchYinYang,
        branchelement: monthBranchElement,
        hiddenStems: hiddenStems[monthBranch],
        zodiac: monthZodiac,
      },
      day: {
        stem: dayStem,
        branch: dayBranch,
        heavenlyelement: dayElement,
        heavenlyyinYang: dayYinYang,
        branchYinYang: dayBranchYinYang,
        branchelement: dayBranchElement,
        hiddenStems: hiddenStems[dayBranch],
        zodiac: dayZodiac,
      },
      hour: {
        stem: hourStem,
        branch: hourBranch,
        heavenlyelement: hourElement,
        heavenlyyinYang: hourYinYang,
        branchYinYang: hourBranchYinYang,
        branchelement: hourBranchElement,
        hiddenStems: hiddenStems[hourBranch],
        zodiac: hourZodiac,
      },
      changSheng: {
        year: changShengYear,
        month: changShengMonth,
        day: changShengDay,
        hour: changShengHour,
      },
      pillarchangsheng: {
        year: pillarchangshengYear,
        month: pillarchangshengMonth,
        day: pillarchangshengDay,
        hour: pillarchangshengHour,
      },
    };
  }

  calculateChangSheng(stemIndex: number): string {
    // สมมติว่ามีการคำนวณ ChangSheng สำหรับ Stem ที่กำหนด
    const changShengMap = {
      1: 'GuanDai',
      2: 'GuanDai',
      3: 'Jue',
      4: 'Jue',
      5: 'LinGuan',
      6: 'LinGuan',
      7: 'DiWang',
      8: 'DiWang',
      9: 'Mu',
      10: 'Mu',
    };
    return changShengMap[stemIndex] || 'Unknown';
  }

  calculatePillarChangSheng(stemIndex: number): string {
    // สมมติว่ามีการคำนวณ Pillar ChangSheng สำหรับ Stem ที่กำหนด
    const pillarChangShengMap = {
      1: 'Yang',
      2: 'Yang',
      3: 'Jue',
      4: 'Jue',
      5: 'Bing',
      6: 'Bing',
      7: 'Si',
      8: 'Si',
      9: 'Sheng',
      10: 'Sheng',
    };
    return pillarChangShengMap[stemIndex] || 'Unknown';
  }

  analyzeElements(bazi: any): any {
    const heavenlyelementCount = {
      Wood: 0,
      Fire: 0,
      Earth: 0,
      Metal: 0,
      Water: 0,
    };
    const earthlyelementCount = {
      Wood: 0,
      Fire: 0,
      Earth: 0,
      Metal: 0,
      Water: 0,
    };

    [bazi.year, bazi.month, bazi.day, bazi.hour].forEach((pillar) => {
      heavenlyelementCount[pillar.heavenlyelement]++;
      pillar.hiddenStems.forEach((stem) => {
        const elementIndex = heavenlyStems.indexOf(stem);
        if (elementIndex >= 0) {
          heavenlyelementCount[heavenlyelements[elementIndex]]++;
        }
      });
    });

    [bazi.year, bazi.month, bazi.day, bazi.hour].forEach((pillar) => {
      earthlyelementCount[pillar.branchelement]++;
      pillar.hiddenStems.forEach((stem) => {
        const elementIndex = earthlyelements.indexOf(stem);
        if (elementIndex >= 0) {
          earthlyelementCount[earthlyelements[elementIndex]]++;
        }
      });
    });

    const minheavenlyElement = Object.keys(heavenlyelementCount).reduce(
      (a, b) => (heavenlyelementCount[a] < heavenlyelementCount[b] ? a : b),
    );
    const maxheavenlyElement = Object.keys(heavenlyelementCount).reduce(
      (a, b) => (heavenlyelementCount[a] > heavenlyelementCount[b] ? a : b),
    );

    const minearthlyElement = Object.keys(earthlyelementCount).reduce((a, b) =>
      earthlyelementCount[a] < earthlyelementCount[b] ? a : b,
    );
    const maxearthlyElement = Object.keys(earthlyelementCount).reduce((a, b) =>
      earthlyelementCount[a] > earthlyelementCount[b] ? a : b,
    );

    return {
      heavenlyelement: {
        heavenlyelementCount,
        weakestElement: minheavenlyElement,
        strongestElement: maxheavenlyElement,
      },
      earthlyelement: {
        earthlyelementCount,
        weakestElement: minearthlyElement,
        strongestElement: maxearthlyElement,
      },
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
