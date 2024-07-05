import { Injectable } from '@nestjs/common';
import { CreateBindYourFortuneDto } from './dto/create-bind-your-fortune.dto';
import * as dayjs from 'dayjs';
import { Lunar, Solar, EightChar, I18n, LunarUtil } from 'lunar-javascript';
const getCZ = require('chinese-zodiac');
// I18n.setLanguage('en');
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
  鼠: {
    thai: 'ปีชวด (หนู)',
    english: 'Year of the Rat',
    chinese: '鼠 (shŭ / สู่)',
  },
  牛: {
    thai: 'ปีฉลู (วัว)',
    english: 'Year of the Ox / Year of the Cow',
    chinese: '牛 (niú / หนิว)',
  },
  虎: {
    thai: 'ปีขาล (เสือ)',
    english: 'Year of the Tiger',
    chinese: '虎 (hǔ / หู่)',
  },
  兔: {
    thai: 'ปีเถาะ (กระต่าย)',
    english: 'Year of the Rabbit',
    chinese: '兔 (tù / ทู่)',
  },
  龙: {
    thai: 'ปีมะโรง (งูใหญ่ / มังกร)',
    english: 'Year of the Dragon',
    chinese: '龙 (lóng / หลง)',
  },
  蛇: {
    thai: 'ปีมะเส็ง (งูเล็ก)',
    english: 'Year of the Snake',
    chinese: '蛇 (shé / เสอ)',
  },
  马: {
    thai: 'ปีมะเมีย (ม้า)',
    english: 'Year of the Horse',
    chinese: '马 (mǎ / หม่า)',
  },
  羊: {
    thai: 'ปีมะแม (แพะ)',
    english: 'Year of the Goat',
    chinese: '羊 (yáng / หย่าง)',
  },
  猴: {
    thai: 'ปีวอก (ลิง)',
    english: 'Year of the Monkey',
    chinese: '猴 (hóu / โหว)',
  },
  鸡: {
    thai: 'ปีระกา (ไก่)',
    english: 'Year of the Rooster',
    chinese: '鸡 (jī / จี)',
  },
  狗: {
    thai: 'ปีจอ (สุนัข)',
    english: 'Year of the Dog',
    chinese: '狗 (gǒu / โก่ว)',
  },
  猪: {
    thai: 'ปีกุน (หมู)',
    english: 'Year of the Pig',
    chinese: '猪 (zhū / จู)',
  },
};

const tenGods = {
  Jia: ['BiJian', 'JieCai', 'ShiShen', 'ShangGuan', 'ZhengCai', 'PianCai', 'ZhengGuan', 'QiSha', 'ZhengYin', 'PianYin'],
  Yi: ['JieCai', 'BiJian', 'ShangGuan', 'ShiShen', 'PianCai', 'ZhengCai', 'QiSha', 'ZhengGuan', 'PianYin', 'ZhengYin'],
  Bing: ['ShiShen', 'ShangGuan', 'BiJian', 'JieCai', 'ZhengCai', 'PianCai', 'QiSha', 'ZhengGuan', 'PianYin', 'ZhengYin'],
  Ding: ['ShangGuan', 'ShiShen', 'JieCai', 'BiJian', 'PianCai', 'ZhengCai', 'ZhengGuan', 'QiSha', 'ZhengYin', 'PianYin'],
  Wu: ['ZhengCai', 'PianCai', 'QiSha', 'ZhengGuan', 'BiJian', 'JieCai', 'ShiShen', 'ShangGuan', 'ZhengYin', 'PianYin'],
  Ji: ['PianCai', 'ZhengCai', 'ZhengGuan', 'QiSha', 'JieCai', 'BiJian', 'ShangGuan', 'ShiShen', 'PianYin', 'ZhengYin'],
  Geng: ['ZhengGuan', 'QiSha', 'ZhengYin', 'PianYin', 'ShiShen', 'ShangGuan', 'BiJian', 'JieCai', 'ZhengCai', 'PianCai'],
  Xin: ['QiSha', 'ZhengGuan', 'PianYin', 'ZhengYin', 'ShangGuan', 'ShiShen', 'JieCai', 'BiJian', 'PianCai', 'ZhengCai'],
  Ren: ['ZhengYin', 'PianYin', 'ShiShen', 'ShangGuan', 'BiJian', 'JieCai', 'ZhengCai', 'PianCai', 'ZhengGuan', 'QiSha'],
  Gui: ['PianYin', 'ZhengYin', 'ShangGuan', 'ShiShen', 'JieCai', 'BiJian', 'PianCai', 'ZhengCai', 'QiSha', 'ZhengGuan']
};

@Injectable()
export class BindYourFortuneService {
  getBazi(createBindYourFortuneDto: CreateBindYourFortuneDto): any {
    const solar = Solar.fromYmdHms(
      Number(createBindYourFortuneDto.dateStr.substring(0, 4)),
      Number(createBindYourFortuneDto.dateStr.substring(5, 7)),
      Number(createBindYourFortuneDto.dateStr.substring(8, 10)),
      Number(createBindYourFortuneDto.timeStr.substring(0, 2)),
      Number(createBindYourFortuneDto.timeStr.substring(3, 5)),
      0
    );
    const lunar = Lunar.fromSolar(solar);
    const eightChar = EightChar.fromLunar(lunar);

    const yearStemIndex = lunar.getYearGanIndex();
    const yearBranchIndex = lunar.getYearZhiIndex();
    const yearStem = heavenlyStems[yearStemIndex];
    const yearBranch = earthlyBranches[yearBranchIndex];
    const yearStemEightChar = eightChar.getYearGan();
    const yearBranchEightChar = eightChar.getYearZhi();
    const yearElement = heavenlyelements[yearStemIndex];
    const yearYinYang = heavenlyyinYang[yearStemIndex];
    const yearBranchYinYang = earthlyyinYang[yearBranchIndex];
    const yearBranchElement = earthlyelements[yearBranchIndex];

    const monthStemIndex = lunar.getMonthGanIndex();
    const monthBranchIndex = lunar.getMonthZhiIndex();
    const monthStem = heavenlyStems[monthStemIndex];
    const monthBranch = earthlyBranches[monthBranchIndex];
    const monthStemEightChar = eightChar.getMonthGan();
    const monthBranchEightChar = eightChar.getMonthZhi();
    const monthElement = heavenlyelements[monthStemIndex];
    const monthYinYang = heavenlyyinYang[monthStemIndex];
    const monthBranchYinYang = earthlyyinYang[monthBranchIndex];
    const monthBranchElement = earthlyelements[monthBranchIndex];

    const dayStemIndex = lunar.getDayGanIndex();
    const dayBranchIndex = lunar.getDayZhiIndex();
    const dayStem = heavenlyStems[dayStemIndex];
    const dayBranch = earthlyBranches[dayBranchIndex];
    const dayStemEightChar = eightChar.getDayGan();
    const dayBranchEightChar = eightChar.getDayZhi();
    const dayElement = heavenlyelements[dayStemIndex];
    const dayYinYang = heavenlyyinYang[dayStemIndex];
    const dayBranchYinYang = earthlyyinYang[dayBranchIndex];
    const dayBranchElement = earthlyelements[dayBranchIndex];

    const hourStemIndex = lunar.getTimeGanIndex();
    const hourBranchIndex = lunar.getTimeZhiIndex();
    const hourStem = heavenlyStems[hourStemIndex];
    const hourBranch = earthlyBranches[hourBranchIndex];
    const hourStemEightChar = eightChar.getTimeGan();
    const hourBranchEightChar = eightChar.getTimeZhi();
    const hourElement = heavenlyelements[hourStemIndex];
    const hourYinYang = heavenlyyinYang[hourStemIndex];
    const hourBranchYinYang = earthlyyinYang[hourBranchIndex];
    const hourBranchElement = earthlyelements[hourBranchIndex];

    const yearZodiac = zodiacSigns[lunar.getYearShengXiao()];
    const monthZodiac = zodiacSigns[lunar.getMonthShengXiao()];
    const dayZodiac = zodiacSigns[lunar.getDayShengXiao()];
    const hourZodiac = zodiacSigns[lunar.getTimeShengXiao()];
    // Calculate Life Stem ChangSheng
    const lifeStemChangShengHour = eightChar.getTimeDiShi();
    const lifeStemChangShengDay = eightChar.getDayDiShi();
    const lifeStemChangShengMonth = eightChar.getMonthDiShi();
    const lifeStemChangShengYear = eightChar.getYearDiShi();

    const tenGodsHour = this.calculateTenGods(dayStem, hourStem);
    const tenGodsDay = this.calculateTenGods(dayStem, dayStem);
    const tenGodsMonth = this.calculateTenGods(dayStem, monthStem);
    const tenGodsYear = this.calculateTenGods(dayStem, yearStem);
    // // Calculate Pillar ChangSheng
    // const pillarChangShengHour = this.calculatePillarChangSheng(hourStemEightChar, hourBranch);
    // const pillarChangShengDay = this.calculatePillarChangSheng(dayStemEightChar, dayBranch);
    // const pillarChangShengMonth = this.calculatePillarChangSheng(monthStemEightChar, monthBranch);
    // const pillarChangShengYear = this.calculatePillarChangSheng(yearStemEightChar, yearBranch);
    const baziData = {
      year: {
        stem: yearStem,
        yearStemEightChar: yearStemEightChar,
        branch: yearBranch,
        yearBranchEightChar: yearBranchEightChar,
        heavenlyelement: yearElement,
        heavenlyyinYang: yearYinYang,
        branchYinYang: yearBranchYinYang,
        branchelement: yearBranchElement,
        hiddenStems: hiddenStems[yearBranch],
        zodiac: yearZodiac,
      },
      month: {
        stem: monthStem,
        monthStemEightChar: monthStemEightChar,
        branch: monthBranch,
        monthBranchEightChar: monthBranchEightChar,
        heavenlyelement: monthElement,
        heavenlyyinYang: monthYinYang,
        branchYinYang: monthBranchYinYang,
        branchelement: monthBranchElement,
        hiddenStems: hiddenStems[monthBranch],
        zodiac: monthZodiac,
      },
      day: {
        stem: dayStem,
        dayStemEightChar: dayStemEightChar,
        branch: dayBranch,
        dayBranchEightChar: dayBranchEightChar,
        heavenlyelement: dayElement,
        heavenlyyinYang: dayYinYang,
        branchYinYang: dayBranchYinYang,
        branchelement: dayBranchElement,
        hiddenStems: hiddenStems[dayBranch],
        zodiac: dayZodiac,
      },
      hour: {
        stem: hourStem,
        hourStemEightChar: hourStemEightChar,
        branch: hourBranch,
        hourBranchEightChar: hourBranchEightChar,
        heavenlyelement: hourElement,
        heavenlyyinYang: hourYinYang,
        branchYinYang: hourBranchYinYang,
        branchelement: hourBranchElement,
        hiddenStems: hiddenStems[hourBranch],
        zodiac: hourZodiac,
      },
      changSheng: {
        year: lifeStemChangShengYear,
        month: lifeStemChangShengMonth,
        day: lifeStemChangShengDay,
        hour: lifeStemChangShengHour,
      },
      // pillarchangsheng: {
      //   year: pillarChangShengYear,
      //   month: pillarChangShengMonth,
      //   day: pillarChangShengDay,
      //   hour: pillarChangShengHour,
      // },
    };
    const analysis = this.analyzeElements(baziData);
    return {
      baziData,
      analysis,
      lifeStem: `${dayStemEightChar} ${dayYinYang} ${dayElement}`,
      favorableElements: this.getFavorableElements(dayStem, analysis),
      unfavorableElements: this.getUnfavorableElements(dayStem, analysis),
    }
  }

  // calculatePillarChangSheng(stem: string, branch: string): string {
  //   const offset = LunarUtil.CHANG_SHENG_OFFSET[stem];
  //   if (offset === undefined) {
  //     throw new Error(`Invalid stem: ${stem}`);
  //   }
  //   const branchIndex = earthlyBranches.indexOf(branch);
  //   if (branchIndex === -1) {
  //     throw new Error(`Invalid branch: ${branch}`);
  //   }
  //   let index = (offset + branchIndex) % 12;
  //   if (index < 0) {
  //     index += 12;
  //   }
  //   return LunarUtil.CHANG_SHENG[index];
  // }

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
  getFavorableElements(dayStem: string, analysis: any): string[] {
    const favorableElements = [];
    if (dayStem === 'Jia' || dayStem === 'Yi') {
      favorableElements.push('Water', 'Wood');
    } else if (dayStem === 'Bing' || dayStem === 'Ding') {
      favorableElements.push('Wood', 'Fire');
    } else if (dayStem === 'Wu' || dayStem === 'Ji') {
      favorableElements.push('Fire', 'Earth');
    } else if (dayStem === 'Geng' || dayStem === 'Xin') {
      favorableElements.push('Earth', 'Metal');
    } else if (dayStem === 'Ren' || dayStem === 'Gui') {
      favorableElements.push('Metal', 'Water');
    }

    return favorableElements;
  }

  getUnfavorableElements(dayStem: string, analysis: any): string[] {
    const unfavorableElements = [];
    if (dayStem === 'Jia' || dayStem === 'Yi') {
      unfavorableElements.push('Fire', 'Earth', 'Metal');
    } else if (dayStem === 'Bing' || dayStem === 'Ding') {
      unfavorableElements.push('Earth', 'Metal', 'Water');
    } else if (dayStem === 'Wu' || dayStem === 'Ji') {
      unfavorableElements.push('Metal', 'Water', 'Wood');
    } else if (dayStem === 'Geng' || dayStem === 'Xin') {
      unfavorableElements.push('Water', 'Wood', 'Fire');
    } else if (dayStem === 'Ren' || dayStem === 'Gui') {
      unfavorableElements.push('Wood', 'Fire', 'Earth');
    }

    return unfavorableElements;
  }

  calculateTenGods(dayStem: string, stem: string): string {
    const stemIndex = heavenlyStems.indexOf(stem);
    if (stemIndex === -1) {
      throw new Error(`Invalid stem: ${stem}`);
    }

    return tenGods[dayStem][stemIndex];
  }
}