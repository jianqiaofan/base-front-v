/**
 * Seller Tool 报价单数据模型（与 SellerToolQuotation.vue 模板字段一致）
 * 使用：const quotation = new Quotation()
 */
class Quotation {
  constructor() {
    this.seller = ''
    this.seller_mail = 'ann.liu@esetsolar.com'
    this.plan_code = ''
    this.project_code = ''
    this.project_name = 'TATA'
    this.client_capacity = '40 MWp'
    this.design_capacity = 39.515
    this.client_company = 'XXX XXXXX'
    this.product_system = 'ESEEK 1P solar tracker'
    this.module_system = '630Wp Bifacial module'
    this.director_remark = ''
    this.cover_info = {
      quotation_date: '06-May-2026',
      quotation_valid_until: '26-May-2026',
    }
    this.project_info = {
      project: 'TATA solar project',
      attention: 'Mr.Xxxx',
      location: `TATA  XX° XX' XX.XX" N – XX° XX' XX.XX" W`,
      refNo: 'XXXX-XXX',
    }
    this.proposed_tracker_solution = {
      product: 'Horizontal Single-Axis tracker / 1P Single-Row',
      drive_system: 'Direct DC motor &  Multipoint Slew Drive',
      control_communication:
        'Network Control Unit (NCU) Control trackers via LoRa wireless protocal (one NCU per weather station). Tracker mounts Tracker Control Unit (TCU) with\n' +
        'inclinometer and its tracking algorithm',
      power_source: 'Self Power/PV String DC power, lithium battery backup',
      design_load: {
        wind: 'ASCE7-22，47 m/s with 3s gust （MRI=50）',
        snow: 'XXX kN/m2',
        other: '',
      },
      corrosion_protection: [
        'Atmosphere C3 as per ISO 12944-2',
        'Torque Tube & Purlin - ZAM 275 g/m2',
        'Post - HDG average 65μm',
        'Fasteners - HDG average 50 μm and SUS for Module mounting Bolt',
      ],
      post_type_embedments_depth: [
        'Ramming Pile',
        'Embedment depth XXX mm',
        'Final Embedment depth up to POT Result confirmation',
      ],
      module_power: 'Bifacial 625 Wp (2382*1134*30 mm)',
      module_no_strings: '28×4，28×2',
      operation_features: [
        '20 m/s stow position with 3 s gust at 10 m',
        'Stow position facing the wind at 60° ',
        'PV String DC powered, lithium battery backup',
      ],
      slope_available: [
        'N-S : 5%, on additional cost upto 15%',
        'E-W : 5%, on additional cost upto 15%',
      ],
      rotation_features: [
        'Rotation Range with 1°  Tacking Accuracy',
        'XXX mm module ground clearance @0°',
      ],
      design: [
        'XXX tons / MW',
        'Wind velocities and pressures as per Standard Building Code',
      ],
      notes: [
        'The final design is related to the confirmation of module, layout and foundation design and other parameters.',
        'any change in these parameters may lead to a revision of the design and price.',
      ],
    }
    this.price_and_payment_terms = {
      currency: 'USD',
      delivery: [
        { id: 1, type: 'FOB', port: 'QINGDAO' },
        { id: 2, type: 'DDP', port: 'Casablanca' },
      ],
      items: [
        {
          id: 1,
          item: ['ESEEK 1P Solar Tracker', 'XXX MWp', 'One TCU per table'],
          description: [
            '1V112,4-strings Exterior:Edge:Int=11.7%:19.5%:59.3%',
            '1V56,2-strings, Exterior:Edge:Int=1.1%:8.4%:0%',
            '1V112,4-strings Exterior:Edge:Int=11.7%:19.5%:59.3%',
            '1V56,2-strings, Exterior:Edge:Int=1.1%:8.4%:0%',
          ],
          prices: [0.0475, 0.0510],
          item_capacity: 39.52,
        },
      ],
      payment_terms: 'XX% payment in advance, XX% payment T/T or L/C prior to shipment.',
      notes: [
        'On site engineering service XXX man * days: installation and commissioning supervision included;',
        'Proportion of exterior and interior tracker subject to the final layout design;',
        'The length of the post and Embedded Post Depth have been calculated on the basis of the geotechnical report received, it may be changed after POT result and caculation;',
        'The Logistics cost in this offer are estimated at the date of the offer. The final cost of the Logistics will be subjected to the real cost upon contract execution.',
      ],
    }
    this.delivery_warranty = {
      incoterms_2010: 'FOB XX/DDP XX',
      port_of_departure: 'QINGDAO',
      no_of_containers: '40HQ x XX',
      first_delivery_lead_time:
        'Within 30 days after down payment received and detailed drawings confirmed by both parties, the final dates to be agreed prior PO and/or Contract signature.',
      estimated_delivery_rate: 'X batch',
      steel_structural_components: '10 years',
      electro_mechanical_components: '7 years',
      galvanizing_protection: '10 years',
    }
    this.construction_spare_parts = {
      fasteners_spares: { percentage: '2.00', price: true },
      up_structure_damper: { percentage: '0.20', price: true },
      control_box_tcu: { percentage: '0.50', price: true },
      post_others: { percentage: '0.50', price: true },
      slew_drive_motor: { percentage: '0.20', price: true },
      communication_box_ncu: { percentage: '0.00', price: true },
    }
    this.tracker_supply = [
      { id: 1, es: 1, cs: 0, op: 0 },
      { id: 2, es: 1, cs: 0, op: 0 },
      { id: 3, es: 1, cs: 0, op: 0 },
      { id: 4, es: 1, cs: 0, op: 0 },
      { id: 5, es: 1, cs: 0, op: 0 },
      { id: 6, es: 1, cs: 0, op: 0 },
      { id: 7, es: 0, cs: 1, op: 0 },
      { id: 8, es: 0, cs: 1, op: 0 },
    ]
    this.Service = [
      { id: 1, es: 1, cs: 0, op: 0 },
      { id: 2, es: 0, cs: 0, op: 1 },
      { id: 3, es: 1, cs: 0, op: 0 },
      { id: 4, es: 0, cs: 0, op: 1 },
      { id: 5, es: 0, cs: 0, op: 1 },
      { id: 6, es: 0, cs: 0, op: 1 },
      { id: 7, es: 0, cs: 1, op: 0 },
      { id: 8, es: 0, cs: 0, op: 1 },
      { id: 9, es: 0, cs: 0, op: 1 },
      { id: 10, es: 0, cs: 1, op: 0 },
      { id: 11, es: 0, cs: 1, op: 0 },
    ]
  }
}

export { Quotation }
