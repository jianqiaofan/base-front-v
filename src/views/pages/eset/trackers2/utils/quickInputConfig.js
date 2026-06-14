export const QUICK_INPUT_SELECT_OPTIONS = {
  product_system_options: [
    { text: '二代单排', value: 'single_row' },
    { text: '三代(通铺)', value: '3Gen_tracker_no_gap' },
    { text: '三代(非通铺)', value: '3Gen_tracker' }
  ],
  pv_layout_options: [
    { text: '1P', value: '1p' },
    { text: '2P', value: '2p' }
  ],
  power_supply_options: [
    { text: '小组件供电', value: '小组件供电' },
    { text: '双组件供电', value: '双组件供电' },
    { text: '组串供电', value: '组串供电' },
    { text: '交流供电', value: '交流供电' }
  ],
  beam_brand_options: [
    { text: '宝华', value: '宝华' },
    { text: '烨辉', value: '烨辉' },
    { text: '首钢', value: '首钢' }
  ],
  purlin_brand_options: [
    { text: '宝华', value: '宝华' },
    { text: '烨辉', value: '烨辉' },
    { text: '首钢', value: '首钢' }
  ],
  corrosion_proofing_grade_options: [
    { text: 'C3', value: 'C3' },
    { text: 'C4', value: 'C4' },
    { text: 'C5', value: 'C5' }
  ],
  post_galvanizin_thickness_options: [
    { text: '≥65μm热镀锌平均', value: '65' },
    { text: '≥85μm热镀锌平均', value: '85' },
    { text: '≥100μm热镀锌平均', value: '100' },
    { text: '≥120μm热镀锌平均', value: '120' }
  ],
  beam_galvanizin_thickness_options: [
    { text: '≥275g/m²锌铝镁镀层', value: '275' },
    { text: '≥310g/m²锌铝镁镀层', value: '310' },
    { text: '≥350g/m²锌铝镁镀层', value: '350' },
    { text: '≥450g/m²锌铝镁镀层', value: '450' },
    { text: '≥475g/m²锌铝镁镀层', value: '475' }
  ],
  purlin_galvanizin_thickness_options: [
    { text: '≥275g/m²锌铝镁镀层', value: '275' },
    { text: '≥310g/m²锌铝镁镀层', value: '310' },
    { text: '≥350g/m²锌铝镁镀层', value: '350' },
    { text: '≥450g/m²锌铝镁镀层', value: '450' },
    { text: '≥475g/m²锌铝镁镀层', value: '475' }
  ],
  slew_drive_inch_options: [
    { text: '5寸一级减速机', value: '5寸一级减速机' },
    { text: '5寸二级减速机', value: '5寸二级减速机' },
    { text: '6寸一级减速机', value: '6寸一级减速机' },
    { text: '7寸减速机', value: '7寸减速机' },
    { text: '8寸减速机', value: '8寸减速机' }
  ],
  slew_cover_if_need_options: [
    { text: '需要', value: true },
    { text: '不需要', value: false }
  ],
  dumper_num_options: [
    { text: 'no damper', value: '0' },
    { text: '1 pair', value: '1pairs' },
    { text: '2 pairs', value: '2pairs' },
    { text: '3 pairs', value: '3pairs' },
    { text: '4 pairs', value: '4pairs' },
    { text: '5 pairs', value: '5pairs' },
    { text: '6 pairs', value: '6pairs' },
    { text: '7 pairs', value: '7pairs' },
    { text: '8 pairs', value: '8pairs' },
    { text: '9 pairs', value: '9pairs' },
    { text: '10 pairs', value: '10pairs' },
    { text: '1 set', value: '1' },
    { text: '2 sets', value: '2' },
    { text: '3 sets', value: '3' },
    { text: '4 sets', value: '4' },
    { text: '5 sets', value: '5' },
    { text: '6 sets', value: '6' },
    { text: '7 sets', value: '7' },
    { text: '8 sets', value: '8' },
    { text: '9 sets', value: '9' },
    { text: '10 sets', value: '10' },
    { text: '11 sets', value: '11' },
    { text: '12 sets', value: '12' },
    { text: '13 sets', value: '13' },
    { text: '14 sets', value: '14' },
    { text: '15 sets', value: '15' },
    { text: '16 sets', value: '16' },
    { text: '17 sets', value: '17' },
    { text: '18 sets', value: '18' },
    { text: '19 sets', value: '19' },
    { text: '20 sets', value: '20' }
  ],
  dumper_type_options: [
    { text: '450阻尼器', value: '450' },
    { text: '500阻尼器', value: '500' },
    { text: '790阻尼器', value: '790' }
  ],
  spring_damper_num_options: [
    { text: 'no damper', value: '0' },
    { text: '1pairs', value: '1pairs' },
    { text: '2pairs', value: '2pairs' },
    { text: '1 set', value: '1' },
    { text: '2 sets', value: '2' },
    { text: '3 sets', value: '3' },
    { text: '4 sets', value: '4' }
  ]
}

export const QUICK_INPUT_FIELD_CONFIGS = [
  { label: '产品系列', field: 'product_system', optionKey: 'product_system_options', inputType: 'select' },
  { label: '组件排布', field: 'pv_layout', optionKey: 'pv_layout_options', inputType: 'select' },
  { label: '组件容量', field: 'pv_capacity', inputType: 'input' },
  { label: '供电方式', field: 'power_supply', optionKey: 'power_supply_options', inputType: 'select' },
  { label: '主梁品牌', field: 'beam_brand', optionKey: 'beam_brand_options', inputType: 'select' },
  { label: '檩条品牌', field: 'purlin_brand', optionKey: 'purlin_brand_options', inputType: 'select' },
  { label: '防腐等级', field: 'corrosion_proofing_grade', optionKey: 'corrosion_proofing_grade_options', inputType: 'select' },
  { label: '立柱防腐', field: 'post_galvanizin_thickness', optionKey: 'post_galvanizin_thickness_options', inputType: 'select' },
  { label: '主梁防腐', field: 'beam_galvanizin_thickness', optionKey: 'beam_galvanizin_thickness_options', inputType: 'select' },
  { label: '檩条防腐', field: 'purlin_galvanizin_thickness', optionKey: 'purlin_galvanizin_thickness_options', inputType: 'select' },
  { label: '减速机型号', field: 'slew_drive_inch', optionKey: 'slew_drive_inch_options', inputType: 'select' },
  { label: '减速机罩', field: 'slew_cover_if_need', optionKey: 'slew_cover_if_need_options', inputType: 'select' },
  { label: '阻尼套数', field: 'dumper_num', optionKey: 'dumper_num_options', inputType: 'select' },
  { label: '阻尼型号', field: 'dumper_type', optionKey: 'dumper_type_options', inputType: 'select' },
  { label: '弹簧阻尼', field: 'spring_damper_num', optionKey: 'spring_damper_num_options', inputType: 'select' }
]
