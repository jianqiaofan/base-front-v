// import { getToken } from '@/utils/auth'

import { getToken } from '@/utils/auth'

export default {
    //选择框可先项
    select_option: {
      category: [
        { label: 'Fixed Structure', value: 'Fixed Structure' },
        { label: '1P Tracker', value: '1P Tracker' },
        { label: '2P Tracker', value: '2P Tracker' },
        { label: 'Car Shed', value: 'Car Shed' },
        { label: 'Tensile structure', value: 'Tensile structure' },
        { label: 'Other', value: 'Other' }
      ],
      designer: [
        { value: '万龙波', label: '万龙波' },
        { value: '温炳钰', label: '温炳钰' },
        { value: '李曜', label: '李曜' },
        { value: '郭云杰', label: '郭云杰' },
        { value: '李淑君', label: '李淑君' },
        { value: '王廷风', label: '王廷风' },
        { value: '郭晨璞', label: '郭晨璞' },
        { value: '张应龙', label: '张应龙' },
        { value: '刘煜', label: '刘煜' },
        { value: '王鹏飞', label: '王鹏飞' },
        { value: '周卫', label: '周卫' },
        { value: '马路', label: '马路' },
        { value: '殷雨', label: '殷雨' },
        { value: '杨立', label: '杨立' },
        { value: '刘子昕', label: '刘子昕' },
        { value: '李彬Ben', label: '李彬Ben' },
        { value: '李彬Oscar', label: '李彬Oscar' },
        { value: '曹仕君', label: '曹仕君' },
        { value: '吴传淇', label: '吴传淇' },
        { value: '杨沐玮', label: '杨沐玮' },
        { value: '马骏', label: '马骏' },
        { value: '王雷', label: '王雷' },
        { value: '陈颠颠', label: '陈颠颠' },
        { value: '邵雪猛', label: '邵雪猛' },
        { value: '张晗', label: '张晗' },
        { value: '许渊贤', label: '许渊贤' },
        { value: '刘志全', label: '刘志全' },
        { value: '郭超超', label: '郭超超' },
        { value: '郭相利', label: '郭相利' },
        { value: 'Suneel Kumar Yadav', label: 'Suneel Kumar Yadav' },
        { value: 'Ahmad Shahab', label: 'Ahmad Shahab' },
        { value: 'Jagannatha Gowdagere Hanumanthappa', label: 'Jagannatha Gowdagere Hanumanthappa' },
        { value: 'Aravindan Anguraj', label: 'Aravindan Anguraj' },
        { value: 'Francisco Amieiro Perez', label: 'Francisco Amieiro Perez' },
        { value: '范建桥', label: '范建桥' }
      ],
      siteClassification: [
        { label: '========中东和非洲middle_east_africa========', value: 'middle_east_africa' },
        { label: '南部非洲区域south_africa', value: 'south_africa' },
        { label: '中东和北非middle_east_and_north_africa', value: 'middle_east_and_north_africa' },
        { label: '========亚太asia_pacific========', value: 'asia_pacific' },
        { label: '东亚east_asia', value: 'east_asia' },
        { label: '东南亚southeast_asia', value: 'southeast_asia' },
        { label: '中亚central_asia', value: 'central_asia' },
        { label: '南亚south_asia', value: 'south_asia' },
        { label: '西亚west_asia', value: 'west_asia' },
        { label: '亚太其他asia_pacific_other', value: 'asia_pacific_other' },
        { label: '========欧洲========', value: 'europe' },
        { label: '西欧europe', value: 'western_europe' },
        { label: '北欧nordic', value: 'nordic' },
        { label: '中欧central_europe', value: 'central_europe' },
        { label: '东欧eastern_europe', value: 'eastern_europe' },
        { label: '南欧southern_europe', value: 'southern_europe' },
        { label: '欧洲其他europe_other', value: 'europe_other' },
        { label: '========拉美latin_america========', value: 'latin_america' },
        { label: '中美洲central_america', value: 'central_america' },
        { label: '南美洲south_america', value: 'south_america' },
        { label: '加勒比地区caribbean_region', value: 'caribbean_region' }
      ],
      optionsMap: {
        south_africa: ['南非(South Africa)', '博茨瓦纳(Botswana)', '津巴布韦(Zimbabwe)', '莫桑比克(Mozambique)', '斯威士兰(Eswatini)', '莱索托(Lesotho)', '马拉维(Malawi)', '赞比亚(Zambia)', '安哥拉(Angola)', '纳米比亚(Namibia)', '马达加斯加(Madagascar)', '毛里求斯(Mauritius)', '科摩罗(Comoros)', '塞舌尔(Seychelles)', '坦桑尼亚(Tanzania)', '肯尼亚(Kenya)', '乌干达(Uganda)', '卢旺达(Rwanda)', '布隆迪(Burundi)', '刚果(Republic of the Congo)（布）', '刚果(Democratic Republic of the Congo)（金）', '赤道几内亚(Equatorial Guinea)', '加蓬(Gabon)', '中非共和国(Central African Republic)', '喀麦隆(Cameroon)', '乍得(Chad)', '几内亚(Guinea)', '几内亚比绍(Guinea-Bissau)', '佛得角(Cape Verde)', '塞内加尔(Senegal)', '马里(Mali)', '布基纳法索(Burkina Faso)', '尼日尔(Niger)', '尼日利亚(Nigeria)', '贝宁(Benin)', '多哥(Togo)', '加纳(Ghana)', '科特迪瓦(Ivory Coast)', '利比里亚(Liberia)', '塞拉利昂(Sierra Leone)', '冈比亚(The Gambia)'],
        middle_east_and_north_africa: ['埃及(Egypt)', '利比亚(Libya)', '突尼斯(Tunisia)', '阿乐及利亚(Ale and Lia)', '摩洛哥(Morocco)', '苏丹(Sudan)', '沙特阿拉伯(Saudi Arabia)', '阿联酋(United Arab Emirates)', '伊朗(Iran)', '伊拉克(Iraq)', '叙利亚(Syria)', '也门(Yemen)', '阿曼(Oman)', '卡塔尔(Qatar)', '以色列(Israel)', '巴勒斯坦(Palestine)', '巴林(Bahrain)', '科威特(Kuwait)', '黎巴嫩(Lebanon)', '约旦(Jordan)'],
        middle_east_africa: [],

        east_asia: ['中国(China)', '蒙古(Mongolia)', '朝鲜(North Korea)', '韩国(South Korea)', '日本(Japan)'],
        southeast_asia: ['越南(Vietnam)', '老挝(Laos)', '柬埔寨(Cambodia)', '泰国(Thailand)', '缅甸(Myanmar)', '马来西亚(Malaysia)', '印度尼西亚(Indonesia)', '菲律宾(Philippines)', '东帝汶(Timor-Leste)'],
        central_asia: ['哈萨克斯坦(Kazakhstan)', '吉尔吉斯斯坦(Kyrgyzstan)', '塔吉克斯坦(Tajikistan)', '乌兹别克斯坦(Uzbekistan)', '土库曼斯坦(Turkmenistan)', '俄罗斯(Russia)'],
        south_asia: ['尼泊尔(Nepal)', '不丹(Bhutan)', '印度(India)', '巴基斯坦(Pakistan)', '孟加拉国(Bangladesh)', '斯里兰卡(Sri Lanka)', '马尔代夫(Maldives)'],
        west_asia: ['阿塞拜疆(Azerbaijan)', '亚美尼亚(Armenia)'],
        asia_pacific_other: ['文莱(Brunei)', '马绍尔群岛(Marshall Islands)', '密克罗尼西亚联邦(Federated States of Micronesia)', '瑙鲁(Nauru)', '新西兰(New Zealand)', '澳大利亚(Australia)', '帕劳(Palau)', '巴布亚新几内亚(Papua New Guinea)', '萨摩亚(Samoa)', '新加坡(Singapore)', '所罗门群岛(Solomon Islands)', '汤加(Tonga)', '图瓦卢(Tuvalu)', '瓦努阿图(Vanuatu)'],
        asia_pacific: [],

        western_europe: ['爱尔兰(Ireland)', '英国(United Kingdom)', '荷兰(Netherlands)', '比利时(Belgium)', '卢森堡(Luxembourg)', '法国(France)', '摩纳哥(Monaco)'],
        nordic: ['芬兰(Finland)', '瑞典(Sweden)', '挪威(Norway)', '冰岛(Iceland)', '丹麦(Denmark)', '法罗群岛(Faroe Islands)'],
        central_europe: ['德国(Germany)', '波兰(Poland)', '捷克(Czech Republic)', '斯洛伐克(Slovakia)', '匈牙利(Hungary)', '奥地利(Austria)', '列支敦士登(Liechtenstein)', '瑞士(Switzerland)'],
        eastern_europe: ['爱沙尼亚(Estonia)', '拉脱维亚(Latvia)', '立陶宛(Lithuania)', '白俄罗斯(Belarus)', '乌克兰(Ukraine)', '摩尔多瓦(Moldova)'],
        southern_europe: ['西班牙(Spain)', '葡萄牙(Portugal)', '安道尔(Andorra)', '直布罗陀(Gibraltar)', '意大利(Italy)', '马耳他(Malta)', '圣马力诺(San Marino)', '梵蒂冈(Vatican City)', '斯洛文尼亚(Slovenia)', '克罗地亚(Croatia)',
          '波斯尼亚和黑塞哥维那(Bosnia and Herzegovina)', '黑山(Montenegro)', '罗马尼亚(Romania)', '保加利亚(Bulgaria)', '塞尔维亚(Serbia)', '北马其顿(North Macedonia)', '阿尔巴尼亚(Albania)', '希腊(Greece)'],
        europe_other: ['土耳其(Turkey)', '以色列(Israel)', '格鲁吉亚格鲁吉亚(Georgia)'],
        europe: [],

        central_america: ['墨西哥(Mexico)', '危地马拉(Guatemala)', '伯利兹(Belize)', '萨尔瓦多(El Salvador)', '洪都拉斯(Honduras)', '尼加拉瓜(Nicaragua)', '哥斯达黎加(Costa Rica)', '巴拿马(Panama)'],
        south_america: ['智利(Chile)', '阿根廷(Argentina)', '乌拉圭(Uruguay)', '哥伦比亚(Colombia)', '委内瑞拉(Venezuela)', '圭亚那(Guyana)', '苏里南(Suriname)', '巴西(Brazil)', '厄瓜多尔(Ecuador)', '秘鲁(Peru)', '玻利维亚(Bolivia)', '巴拉圭(Paraguay)'],
        caribbean_region: ['古巴(Cuba)', '海地(Haiti)', '多米尼加(Dominican Republic)', '牙买加(Jamaica)', '特立尼达和多巴哥(Trinidad and Tobago)', '巴巴多斯(Barbados)',
          '格林纳达(Grenada)', '圣卢西亚(Saint Lucia)', '圣文森特(Saint Vincent)', '格林纳丁斯(Grenadines)', '巴哈马(Bahamas)', '安提瓜(Antigua)', '巴布达(Barbuda)', '多米尼克(Dominica)', '圣基茨和尼维斯(Saint Kitts and Nevis)'],
        latin_america: []
      },
    },


};

