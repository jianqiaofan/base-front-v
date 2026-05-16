class Quotation {
  constructor() {
    this.seller = ''
    this.seller_mail = 'ann.liu@eset.com'
    this.plan_code = ''
    this.project_code = ''
    this.project_name = 'TRACKER QUOTATION FOR 40 MWdc TATA PROJECT'
    this.capacity = 40
    this.director_remark = ''
    this.cover_info = {
      quotation_date : '06-May-2026',
      quotation_valid_until : '26-May-2026',
      
    }
    this.project_info = {
      project: 'TATA solar project',
      customer: 'JET ENERGY',
      MWDc: 39.515,
      attention: 'Mr.Tarik',
      location: `TATA  29° 58' 58.91" N – 8° 12' 51.45" W`,
      refNo: '',
    }
    this.proposed_tracker_solution = {
      product: 'Horizontal Single-Axis tracker / 1P Single-Row',
      drive_system:  'Direct DC motor &  Multipoint Slew Drive',
      control_communication: 'Network Control Unit (NCU) Control trackers via LoRa wireless protocal (one NCU per weather station). Tracker mounts Tracker Control Unit (TCU) with\n' +
        'inclinometer and its tracking algorithm',
      power_source: 'Self Power/PV String DC power, lithium battery backup',
      design_wind_speed: 'ASCE7-22，47 m/s with 3s gust （MRI=50）',
      corrosion_protection:'Atmosphere C4 as per ISO 12944-2\n' +
        'Torque Tube & Purlin - ZAM 310g/㎡\n' +
        'Post - HDG 85 μm\n' +
        'Fasteners - HDG 55 μm',
      post_type_embedments_depth:'Drive Post Depth =2000mm;\n' +
        'General Post Depth =1500mm;\n' +
        'Final Embedment depth up to POT Result; confirmation',
      module_power: 'Bifacial 625 Wp (2382*1134*30 mm)',
      module_no_strings: '28×4，28×2',
      operation_features: '18 m/s stow position with 3 s gust at 10 m\n' +
        'Stow position facing the wind at 0~3° \n' +
        'Snow load of 0 KN/m²\n' +
        'Earthquake level 0',
      slope_available: 'N-S : Maximum 15%\n' +
        'E-W :  Maximum 15%',
      rotation_features: '±60°  Rotation Range with 1°  Tacking Accuracy\n' +
        '500 mm minimum module ground clearance',
      design: '25-year Structural Design life\n' +
        'Wind velocities and pressures as per Standard Building Code',
  }
    this.price_and_payment_terms = {
        item:`ESEEK 1P Solar Tracker
1V112,4-strings,
Exterior:Edge:Int=11.7%:19.5%:59.3%
1V56,2-strings,
Exterior:Edge:Int=1.1%:8.4%:0%`,
        design_capacity:39.52,
        description:'Ramming Pile',
        FOB:'0.0475',
        CIF:'0.0520',
        CIF_total:0,
        on_site_engineer:75,
        on_site_engineer_included:true,
    }
    this.delivery_warranty = {
      incoterms_2010:'FOB /CIF Casablanca',
      port_of_departure:'QINGDAO',
      no_of_containers:'64  units 40HQ',
      first_delivery_lead_time:'By negotiation',
      estimated_delivery_rate:'By negotiation',
      steel_structural_components:'10 years',
      electro_mechanical_components:'7 years',
      galvanizing_protection:'10 years',
    }
    this.construction_spare_parts = {
      fasteners_spares: {percentage:2,price:true,},
      up_structure_damper: {percentage:0.2,price:true,},
      control_box_tcu: {percentage:0.5,price:true,},
      post_others: {percentage:0.5,price:true,},
      slew_drive_motor: {percentage:0.2,price:true,},
      communication_box_ncu: {percentage:5,price:true,},
    }
    //Item内容不写在tracker_supply中，而是写在模板上，可减少数据库保存时冗余
    //为了减少保存到数据库中数据量，将Item内容不写在数据中，而是在模板上处理，
    // 同时，将eset_scope简写为es,customer_scope简写为cs,optional简写为op,true简写为1,false简写为0
    this.tracker_supply = [
      {id:1,es:1,cs:0,op:0},
      {id:2,es:1,cs:0,op:0},
      {id:3,es:1,cs:0,op:0},
      {id:4,es:1,cs:0,op:0},
      {id:5,es:1,cs:0,op:0},
      {id:6,es:1,cs:0,op:0},
      {id:7,es:0,cs:1,op:0},
      {id:8,es:0,cs:1,op:0}
    ]
    this.Service = [
      {id:1,es:1,cs:0,op:0},
      {id:2,es:0,cs:0,op:1},
      {id:3,es:1,cs:0,op:0},
      {id:4,es:0,cs:0,op:1},
      {id:5,es:0,cs:0,op:1},
      {id:6,es:0,cs:0,op:1},
      {id:7,es:0,cs:1,op:0},
      {id:8,es:0,cs:0,op:1},
      {id:9,es:0,cs:0,op:1},
      {id:10,es:0,cs:1,op:0},
      {id:11,es:0,cs:1,op:0},
    ]
    this.service_extra_onsite_engineer_price=230
  }


}
export { Quotation }

/**
 * 原始的
 * class Quotation {
 *   constructor() {
 *     this.seller = '刘争春'
 *     this.sellerMmail = 'lzc@jseest.com'
 *     this.plan_code = ''
 *     this.plan_description = ''
 *     this.project_code = ''
 *     this.project_name = 'TRACKER QUOTATION FOR 40 MWdc TATA PROJECT'
 *     this.quotation_data = ''
 *     this.quotation_valid_until = ''
 *     this.project_info = {
 *       project: 'TATA solar project',
 *       customer: 'JET ENERGY',
 *       MWDc: 39.515,
 *       attention: 'Mr.Tarik',
 *       location: `TATA  29° 58' 58.91" N – 8° 12' 51.45" W`,
 *       refNo: '',
 *     }
 *     this.proposed_tracker_solution = {
 *       product: 'Horizontal Single-Axis tracker / 1P Single-Row',
 *       drive_system:  'Direct DC motor &  Multipoint Slew Drive',
 *       control_communication: 'Network Control Unit (NCU) Control trackers via LoRa wireless protocal (one NCU per weather station). Tracker mounts Tracker Control Unit (TCU) with\n' +
 *         'inclinometer and its tracking algorithm',
 *       power_source: 'Self Power/PV String DC power, lithium battery backup',
 *       design_wind_speed: 'ASCE7-22，47 m/s with 3s gust （MRI=50）',
 *       corrosion_protection:'Atmosphere C4 as per ISO 12944-2\n' +
 *         'Torque Tube & Purlin - ZAM 310g/㎡\n' +
 *         'Post - HDG 85 μm\n' +
 *         'Fasteners - HDG 55 μm',
 *       post_type_embedments_depth:'Drive Post Depth =2000mm;\n' +
 *         'General Post Depth =1500mm;\n' +
 *         'Final Embedment depth up to POT Result; confirmation',
 *       module_power: 'Bifacial 625 Wp (2382*1134*30 mm)',
 *       module_no_strings: '28×4，28×2',
 *       operation_features: '18 m/s stow position with 3 s gust at 10 m\n' +
 *         'Stow position facing the wind at 0~3° \n' +
 *         'Snow load of 0 KN/m²\n' +
 *         'Earthquake level 0',
 *       slope_available: 'N-S : Maximum 15%\n' +
 *         'E-W :  Maximum 15%',
 *       rotation_features: '±60°  Rotation Range with 1°  Tacking Accuracy\n' +
 *         '500 mm minimum module ground clearance',
 *       design: '25-year Structural Design life\n' +
 *         'Wind velocities and pressures as per Standard Building Code',
 *   }
 *     this.price_and_payment_terms = {
 *         item:`ESEEK 1P Solar Tracker
 * 1V112,4-strings,
 * Exterior:Edge:Int=11.7%:19.5%:59.3%
 * 1V56,2-strings,
 * Exterior:Edge:Int=1.1%:8.4%:0%`,
 *         design_capacity:39.52,
 *         description:'Ramming Pile',
 *         FOB:'0.0475',
 *         CIF:'0.0520',
 *         CIF_total:0,
 *         on_site_engineer:75,
 *         on_site_engineer_included:true,
 *     }
 *     this.delivery_warranty = {
 *       incoterms_2010:'FOB /CIF Casablanca',
 *       port_of_departure:'QINGDAO',
 *       no_of_containers:'64  units 40HQ',
 *       first_delivery_lead_time:'By negotiation',
 *       estimated_delivery_rate:'By negotiation',
 *       steel_structural_components:'10 years',
 *       electro_mechanical_components:'7 years',
 *       galvanizing_protection:'10 years',
 *     }
 *     this.construction_spare_parts = {
 *       fasteners_spares: {percentage:2,price:true,},
 *       up_structure_damper: {percentage:0.2,price:true,},
 *       control_box_tcu: {percentage:0.5,price:true,},
 *       post_others: {percentage:0.5,price:true,},
 *       slew_drive_motor: {percentage:0.2,price:true,},
 *       communication_box_ncu: {percentage:5,price:true,},
 *     }
 *     this.tracker_supply = [
 *       {id:1,eset_scope:true,customer_scope:false,optional:false,item:'Module Mounting Structures (post, torque tube, purlins, bearing,  weather station pole,  connection components etc.)'},
 *       {id:2,eset_scope:true,customer_scope:false,optional:false,item:'Mechanical & electrical part for driving and control (motors, slew drive, tracker control units with  tilt sensor , communication box, wind speed sensor, tilt sensor,dampers etc.)'},
 *       {id:3,eset_scope:true,customer_scope:false,optional:false,item:'Fasteners for structure connection and solar module fixing.'},
 *       {id:4,eset_scope:true,customer_scope:false,optional:false,item:'Internal cables: DC cable for string power to control unit, control unit to the motor, wind speed sensor to NCU.'},
 *       {id:5,eset_scope:true,customer_scope:false,optional:false,item:'Grounding cable from torque tube to post.'},
 *       {id:6,eset_scope:true,customer_scope:false,optional:false,item:'Spare parts during the construction period'},
 *       {id:7,eset_scope:false,customer_scope:true,optional:false,item:'J-bolts and nuts for concrete post foundation and wind sensor pole foundation (if applicable)'},
 *       {id:8,eset_scope:false,customer_scope:true,optional:false,item:'Grounding strip/cable from structure to earthing net.'}
 *     ]
 *
 *     this.Service = [
 *       {id:1,eset_scope:true,customer_scope:false,optional:false,item:'Tracker design and engineering (Including static, dynamic and instability aeroelastic analysis.)'},
 *       {id:2,eset_scope:false,customer_scope:false,optional:true,item:'Extra On-site Service 230USD/day/engineer'},
 *       {id:3,eset_scope:true,customer_scope:false,optional:false,item:'Preliminary layout for tracker'},
 *       {id:4,eset_scope:false,customer_scope:false,optional:true,item:'PVSyst simulation report'},
 *       {id:5,eset_scope:false,customer_scope:false,optional:true,item:'Tracker foundation civil design'},
 *       {id:6,eset_scope:false,customer_scope:false,optional:true,item:'POT service(Technical Guidance)'},
 *       {id:7,eset_scope:false,customer_scope:true,optional:false,item:'Site unloading of supply products'},
 *       {id:8,eset_scope:false,customer_scope:false,optional:true,item:'Temporary storage or delays and special needs for packing'},
 *       {id:9,eset_scope:false,customer_scope:false,optional:true,item:'Special fumigation requirements or other destination specific requirements'},
 *       {id:10,eset_scope:false,customer_scope:true,optional:false,item:'Tracker installation and solar module mounting'},
 *       {id:11,eset_scope:false,customer_scope:true,optional:false,item:'Grounding/Earthing work'},
 *     ]
 *     this.service_extra_onsite_engineer_price=230
 *   }
 * }
 */
