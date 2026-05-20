<template>
  <div class="container-seller-quotation">
    <div class="sq-pdf-toolbar">
      <el-button type="primary" size="small" icon="el-icon-download" :loading="pdfExporting"
        @click="exportQuotationPdf">
        导出 PDF（三页合一）
      </el-button>
    </div>
    <!-- quotation 1: cover（文案与缩略图一致；图片来自 q.fig 内嵌资源） -->
    <div class="seller-quotation-frame seller-quotation-frame--1" data-figma-frame="quotation 1"
      aria-label="quotation 1">
      <div class="sq-inner sq-inner--cover">
        <header class="sq-cover-head">
          <img class="sq-cover-logo" :src="assets.logo" width="300" height="78" alt="ESET SOLAR" />
        </header>

        <div class="sq-cover-hero">
          <img class="sq-cover-hero-img" :src="assets.hero" alt="" />
          <div class="sq-cover-hero-overlay">
            <p class="sq-cover-kicker">
              <double-click-to-input :obj="q" prop-name="project_name" />
            </p>
            <p class="sq-cover-sub">at XXX, XXX PROJECT</p>
          </div>
        </div>

        <div class="sq-cover-meta">
          <p>
            Quotation date:
            <double-click-to-input :obj="q" prop-name="cover_info.quotation_date" />
          </p>
          <p>
            Quotation valid until:
            <double-click-to-input :obj="q" prop-name="cover_info.quotation_valid_until" />
          </p>
          <p>
            <double-click-to-input :obj="q" prop-name="seller_mail" />
          </p>
        </div>

        <p class="sq-cover-company">Jiangsu EverShine Energy Technology Co., Ltd.</p>

        <div class="sq-cover-body">
          <p>
            This proposed technical solution and commercial offer has been prepared for the supply of ESEEK 1P solar
            tracker with a total peak power of
            <double-click-to-input :obj="q" prop-name="capacity" numeric />
            MWp, based on XXRp Bifacial module.
          </p>
          <p>
            ESEEK solar tracker adopts Slew drive, which can have flexible design available, good adaptability for
            complex
            terrain, and the innovation of diamond-shaped torque tube, providing better bending and torsional
            capabilities
            with minimum material. ESET team will fully assist XXX from product design, production, transportation,
            on-site guidance for installation and commissioning to ensure the success of the project.
          </p>
        </div>
      </div>
    </div>

    <!-- quotation 2: 技术方案（.fig 无法解析各 Frame 文本；使用项目 Quotation 默认字段，版式对齐封面字号与边距） -->
    <div class="seller-quotation-frame seller-quotation-frame--2" data-figma-frame="quotation 2"
      aria-label="quotation 2">
      <div class="sq-inner sq-inner--document">
        <header class="sq-doc-head">
          <img class="sq-doc-logo" :src="assets.logo" width="300" height="78" alt="ESET SOLAR" />
        </header>
        <!--1 Project Info==============================-->
        <div class="table1">
          <span class="catalog">1 Project Info</span>
          <hr>
          <table>
            <tr>
              <td class="sq-td--w40">Project:</td>
              <td class="sq-td--w400">{{ q.project_info.project }}</td>
              <td class="sq-td--w40">Customer:</td>
              <td class="sq-td--w200">{{ q.project_info.customer }}</td>
            </tr>
            <tr>
              <td>MWDc:</td>
              <td>{{ q.project_info.MWDc }}</td>
              <td>Attention:</td>
              <td>{{ q.project_info.attention }}</td>
            </tr>
            <tr>
              <td>Location:</td>
              <td>{{ q.project_info.location }}</td>
              <td>REF. No.:</td>
              <td>{{ q.project_info.refNo }}</td>
            </tr>
          </table>
        </div>

        <!--2 Proposed Tracker Solution==============================-->
        <div class="table2">
          <span class="catalog">2 Proposed Tracker Solution</span>
          <hr>
          <table>
            <tr>
              <td class="sq-td--w100">Product:</td>
              <td class="sq-td--w240">{{ q.proposed_tracker_solution.product }}</td>
              <td class="sq-td--w100">Module power:</td>
              <td>{{ q.proposed_tracker_solution.module_power }}</td>
            </tr>

            <tr>
              <td>Drive system:</td>
              <td>{{ q.proposed_tracker_solution.drive_system }}</td>
              <td>Module No. / Strings</td>
              <td>{{ q.proposed_tracker_solution.module_no_strings }}</td>
            </tr>

            <tr>
              <td>Control & Communication:</td>
              <td>{{ q.proposed_tracker_solution.control_communication }}</td>
              <td>Operation Features:</td>
              <td>{{ q.proposed_tracker_solution.operation_features }}</td>
            </tr>

            <tr>
              <td>Power Source:</td>
              <td>{{ q.proposed_tracker_solution.power_source }}</td>
              <td>Slope available:</td>
              <td>{{ q.proposed_tracker_solution.slope_available }}</td>
            </tr>

            <tr>
              <td>Design Wind speed:</td>
              <td>{{ q.proposed_tracker_solution.design_wind_speed }}</td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>Corrosion protection:</td>
              <td>{{ q.proposed_tracker_solution.corrosion_protection }}
              </td>
              <td>Rotation Features:</td>
              <td>{{ q.proposed_tracker_solution.rotation_features }}</td>
            </tr>

            <tr>
              <td>Post type & Embedments Depth:</td>
              <td>{{ q.proposed_tracker_solution.post_type_embedments_depth }}</td>
              <td>Design:</td>
              <td>{{ q.proposed_tracker_solution.design }}</td>
            </tr>
          </table>

          <div class="sq-callout">
            <table>
              <tr>
                <td class="sq-note-label-cell"><span class="note">Note:</span></td>
                <td class="sq-note-value-cell">
                  <double-click-to-input
                    :obj="q"
                    prop-name="proposed_tracker_solution.notes"
                    display-class="note"
                    block
                    :array-rows="5"
                  />
                </td>
              </tr>
            </table>

          </div>
        </div>

        <!--3 Price and Payment Terms==============================-->
        <div class="table3">
          <span class="catalog">3 Price and Payment Terms</span>
          <hr>
          <table>
            <thead>
              <tr>
                <td class="sq-price-head sq-price-head--item">Item</td>
                <td class="sq-price-head sq-price-head--std">Design Capacity<br>（MW）</td>
                <td class="sq-price-head sq-price-head--std">Description</td>
                <td class="sq-price-head sq-price-head--std">USD / Wp<br>FOB Qingdao</td>
                <td class="sq-price-head sq-price-head--std">USD / Wp<br>CIF Casablanca</td>
                <td class="sq-price-head sq-price-head--std">Total Amount/USD<br>CIF Casablanca</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="sq-td-left">
                  <span class="note" v-for="(item, index) in q.price_and_payment_terms.item" :key="index">
                    {{ item }}
                    <br>
                  </span>
                </td>
                <td class="sq-td-center">{{ q.price_and_payment_terms.design_capacity }}</td>
                <td class="sq-td-center">{{ q.price_and_payment_terms.description }}</td>
                <td class="sq-td-center">{{ q.price_and_payment_terms.FOB }}</td>
                <td class="sq-td-center">{{ q.price_and_payment_terms.CIF }}</td>
                <td class="sq-td-center">{{ q.price_and_payment_terms.CIF_total }}</td>
              </tr>
              <tr>
                <td colspan="5" class="sq-td-center">On site engineer service
                  {{ q.price_and_payment_terms.on_site_engineer }} man*days
                </td>
                <td class="sq-td-center">
                  {{ q.price_and_payment_terms.on_site_engineer_included ? 'Included' : '' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="sq-callout">
            <table>
              <tr>
                <td class="sq-note-label-cell"><span class="note">Payment Term:</span></td>
                <td><span class="note">By negotiation</span></td>
              </tr>
            </table>
          </div>
          <div class="sq-spacer sq-spacer--y6" aria-hidden="true"></div>
          <div class="sq-callout">
            <table>
              <tr>
                <td class="sq-note-label-cell"><span class="note">Note:</span></td>
                <td class="sq-note-value-cell">
                  <double-click-to-input
                    :obj="q"
                    prop-name="price_and_payment_terms.notes"
                    display-class="note"
                    block
                    :array-rows="5"
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!--4 Delivery and Warranty==============================-->
        <div class="table4">
          <span class="catalog">4 Delivery and Warranty</span>
          <hr>
          <table>
            <tr>
              <td class="sq-td--w700">
                <table>
                  <tr>
                    <td class="sq-td--w200 sq-td--tl">Incoterms 2010:fdsa</td>
                    <td class="sq-td--tl">{{ q.delivery_warranty.incoterms_2010 }}</td>
                  </tr>
                  <tr>
                    <td>Port of Departure:</td>
                    <td>{{ q.delivery_warranty.port_of_departure }}</td>
                  </tr>
                  <tr>
                    <td>No. of Containers:</td>
                    <td>{{ q.delivery_warranty.no_of_containers }}</td>
                  </tr>
                  <tr>
                    <td>1st Delivery lead time:</td>
                    <td>{{ q.delivery_warranty.first_delivery_lead_time }}</td>
                  </tr>
                  <tr>
                    <td>Estimated Delivery rate:</td>
                    <td>{{ q.delivery_warranty.estimated_delivery_rate }}</td>
                  </tr>
                </table>
              </td>
              <td class="sq-td--w500">
                <table>
                  <tr>
                    <td colspan="2" class="sq-td--tl">
                      ESET warrants that’s its product when sold and delivered under the conditions of the purcurement
                      agreement, will be new, will follow to the ISO standards, be free from defects in material
                      and/or
                      workmanship for a period from the date of delivery of the product under the incoterms agreed.
                      <br>
                      <br>
                      <br>
                    </td>
                  </tr>
                  <tr>
                    <td class="sq-td--w200">Steel structural components:</td>
                    <td>10 years</td>
                  </tr>
                  <tr>
                    <td>Electro & Mechanical components:</td>
                    <td>{{ q.delivery_warranty.electro_mechanical_components }}</td>
                  </tr>
                  <tr>
                    <td>Galvanizing protection:</td>
                    <td>{{ q.delivery_warranty.galvanizing_protection }}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <!--5 Construction spare parts for a successful installation==============================-->
        <div class="table5">
          <span class="catalog">5 Construction spare parts for a successful installation</span>
          <hr>
          <table>
            <tr>
              <td class="sq-td--w600">
                <table>
                  <thead>
                    <tr>
                      <td class="sq-td--w300 sq-td--tl">Construction spares parts</td>
                      <td class="sq-td--w200">Percentage</td>
                      <td class="sq-td--w200">Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fasteners spares</td>
                      <td>{{ q.construction_spare_parts.fasteners_spares.percentage }}%</td>
                      <td>
                        {{ q.construction_spare_parts.fasteners_spares.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    <tr>
                      <td>Up Structure & Damper</td>
                      <td>{{ q.construction_spare_parts.up_structure_damper.percentage }}%</td>
                      <td>
                        {{ q.construction_spare_parts.up_structure_damper.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    <tr>
                      <td>Control Box (TCU)</td>
                      <td>{{ q.construction_spare_parts.control_box_tcu.percentage }}%</td>
                      <td>{{ q.construction_spare_parts.control_box_tcu.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td class="sq-td--w500">
                <table>
                  <thead>
                    <tr>
                      <td class="sq-td--w300 sq-td--tl">Construction spares parts</td>
                      <td class="sq-td--w200">Percentage</td>
                      <td class="sq-td--w200">Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Post & others</td>
                      <td>{{ q.construction_spare_parts.post_others.percentage }}%</td>
                      <td>{{ q.construction_spare_parts.post_others.price ? 'included' : 'not included' }}</td>
                    </tr>
                    <tr>
                      <td>Slew drive & Motor</td>
                      <td>{{ q.construction_spare_parts.slew_drive_motor.percentage }}%</td>
                      <td>
                        {{ q.construction_spare_parts.slew_drive_motor.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    <tr>
                      <td>Communication Box (NCU)</td>
                      <td>{{ q.construction_spare_parts.communication_box_ncu.percentage }}%</td>
                      <td>
                        {{
                          q.construction_spare_parts.communication_box_ncu.price ? 'included' : 'not included'
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- quotation 3: 商务条款（同上） -->
    <div class="seller-quotation-frame seller-quotation-frame--3" data-figma-frame="quotation 3"
      aria-label="quotation 3">
      <div class="sq-inner sq-inner--document">
        <header class="sq-doc-head">
          <img class="sq-doc-logo" :src="assets.logo" width="300" height="78" alt="ESET SOLAR" />
        </header>

        <h3>Annexure 1 Scope of Supply & Service</h3>
        <div class="sq-annex-panel">
          <h3>Tracker Supply</h3>
          <table class="sq-annex-table">
            <thead>
              <tr>
                <td class="sq-annex-col-no">No.</td>
                <td>Item</td>
                <td class="sq-annex-col-tag">ESET Scope</td>
                <td class="sq-annex-col-tag">Customer<br>Scope</td>
                <td class="sq-annex-col-tag">Optional</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in q.tracker_supply" :key="item.id">
                <td class="sq-td-index">{{ item.id }}</td>
                <td>{{ tracker_supply_item[item.id] }}</td>
                <td class="sq-td-center sq-annex-scope-cell" title="双击选择 ESET Scope"
                  @dblclick="setAnnexRowScope(item, 'es')">{{ item.es | filterChecked }}</td>
                <td class="sq-td-center sq-annex-scope-cell" title="双击选择 Customer Scope"
                  @dblclick="setAnnexRowScope(item, 'cs')">{{ item.cs | filterChecked }}</td>
                <td class="sq-td-center sq-annex-scope-cell" title="双击选择 Optional"
                  @dblclick="setAnnexRowScope(item, 'op')">{{ item.op | filterChecked }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sq-annex-panel">
          <h3>Service</h3>
          <table class="sq-annex-table">
            <thead>
              <tr>
                <td class="sq-annex-col-no">No.</td>
                <td>Item</td>
                <td class="sq-annex-col-tag">ESET Scope</td>
                <td class="sq-annex-col-tag">Customer<br>Scope</td>
                <td class="sq-annex-col-tag">Optional</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in q.Service" :key="item.id">
                <td class="sq-td-index">{{ item.id }}</td>
                <td>{{ service_item[item.id] }}</td>
                <td class="sq-td-center sq-annex-scope-cell" title="双击选择 ESET Scope"
                  @dblclick="setAnnexRowScope(item, 'es')">{{ item.es | filterChecked }}</td>
                <td class="sq-td-center sq-annex-scope-cell" title="双击选择 Customer Scope"
                  @dblclick="setAnnexRowScope(item, 'cs')">{{ item.cs | filterChecked }}</td>
                <td class="sq-td-center sq-annex-scope-cell" title="双击选择 Optional"
                  @dblclick="setAnnexRowScope(item, 'op')">{{ item.op | filterChecked }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Quotation } from '@/views/pages/eset/trackers2/utils/classQuotation'
import DoubleClickToInput from './DoubleClickToInput.vue'
import logoUrl from './fromFig/esetlogo.png'
import heroUrl from './fromFig/cover_img.jpg'

export default {
  name: 'SellerToolQuotation',
  components: {
    DoubleClickToInput,
  },
  props: {
    /** 由父页面传入时，预览与父表单共用同一 Quotation 实例 */
    quotationParent: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      inputData:{},
      quotation:{},
      pdfExporting: false,
      internalQuotation: new Quotation(),
      assets: {
        logo: logoUrl,
        hero: heroUrl,
      },

      //将第三页部分内容写到这，减少保存quotation时数据库冗余
      tracker_supply_item: {
        1: 'Module Mounting Structures (post, torque tube, purlins, bearing,  weather station pole,  connection components etc.)',
        2: 'Mechanical & electrical part for driving and control (motors, slew drive, tracker control units with  tilt sensor , communication box, wind speed sensor, tilt sensor,dampers etc.)',
        3: 'Fasteners for structure connection and solar module fixing.',
        4: 'Internal cables: DC cable for string power to control unit, control unit to the motor, wind speed sensor to NCU.',
        5: 'Grounding cable from torque tube to post.',
        6: 'Spare parts during the construction period',
        7: 'J-bolts and nuts for concrete post foundation and wind sensor pole foundation (if applicable)',
        8: 'Grounding strip/cable from structure to earthing net.'
      },

      service_item: {
        1: 'Tracker design and engineering (Including static, dynamic and instability aeroelastic analysis.)',
        2: 'Extra On-site Service 230USD/day/engineer',
        3: 'Preliminary layout for tracker',
        4: 'PVSyst simulation report',
        5: 'Tracker foundation civil design',
        6: 'POT service(Technical Guidance)',
        7: 'Site unloading of supply products',
        8: 'Temporary storage or delays and special needs for packing',
        9: 'Special fumigation requirements or other destination specific requirements',
        10: 'Tracker installation and solar module mounting',
        11: 'Grounding/Earthing work'
      }
    }
  },
  computed: {
    q() {
      return this.quotation
    },
  },
  methods: {
    /** 将本行 √ 移到被双击的 ESET / Customer / Optional 列（互斥） */
    setAnnexRowScope(row, scope) {
      if (!row || !['es', 'cs', 'op'].includes(scope)) return
      this.$set(row, 'es', scope === 'es' ? 1 : 0)
      this.$set(row, 'cs', scope === 'cs' ? 1 : 0)
      this.$set(row, 'op', scope === 'op' ? 1 : 0)
    },
    async exportQuotationPdf() {
      this.pdfExporting = true
      try {
        await this.$nextTick()
        const frames = this.$el.querySelectorAll('.seller-quotation-frame')
        if (!frames.length) {
          this.$message.warning('未找到报价单页面区域')
          return
        }
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
        const pageW = 210
        const pageH = 297
        for (let i = 0; i < frames.length; i++) {
          const el = frames[i]
          const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
          })
          const imgData = canvas.toDataURL('image/jpeg', 0.92)
          if (i > 0) {
            pdf.addPage()
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH)
        }
        pdf.save(`Tracker-Quotation-${new Date().toISOString().slice(0, 10)}.pdf`)
        this.$message.success('PDF 已下载')
      } catch (e) {
        console.error(e)
        this.$message.error('导出 PDF 失败，请稍后重试')
      } finally {
        this.pdfExporting = false
      }
    },
  },
  mounted() {
    // if (this.quotationParent) {
    //   this.quotation = this.quotationParent
    //   return
    // }
    this.quotation =  {
        seller: '',
        seller_mail: 'ann.liu@eset.com',
        plan_code: '',
        project_code: '',
        project_name: 'TRACKER QUOTATION FOR 40 MWdc TATA PROJECT',
        capacity: 40,
        director_remark: '',
        cover_info: {
          quotation_date: '06-May-2026',
          quotation_valid_until: '26-May-2026',
        },
        project_info: {
          project: 'TATA solar project',
          customer: 'JET ENERGY',
          MWDc: 39.515,
          attention: 'Mr.Tarik',
          location: `TATA  29° 58' 58.91" N – 8° 12' 51.45" W`,
          refNo: '',
        },
        proposed_tracker_solution: {
          product: 'Horizontal Single-Axis tracker / 1P Single-Row',
          drive_system: 'Direct DC motor &  Multipoint Slew Drive',
          control_communication: 'Network Control Unit (NCU) Control trackers via LoRa wireless protocal (one NCU per weather station). Tracker mounts Tracker Control Unit (TCU) with\n' +
            'inclinometer and its tracking algorithm',
          power_source: 'Self Power/PV String DC power, lithium battery backup',
          design_wind_speed: 'ASCE7-22，47 m/s with 3s gust （MRI=50）',
          corrosion_protection: 'Atmosphere C4 as per ISO 12944-2\n' +
            'Torque Tube & Purlin - ZAM 310g/㎡\n' +
            'Post - HDG 85 μm\n' +
            'Fasteners - HDG 55 μm',
          post_type_embedments_depth: 'Drive Post Depth =2000mm;\n' +
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
          notes: ['The final design is related to the confirmation of module, layout and foundation design and other parameters.',
                'any change in these parameters may lead to a revision of the design and price.'
            ]
        },
        price_and_payment_terms: {
          item:['ESEEK 1P Solar Tracker', '1V112,4-strings Exterior:Edge:Int=11.7%:19.5%:59.3%','1V56,2-strings, Exterior:Edge:Int=1.1%:8.4%:0%', '1V112,4-strings Exterior:Edge:Int=11.7%:19.5%:59.3%','1V56,2-strings, Exterior:Edge:Int=1.1%:8.4%:0%'],
          design_capacity: 39.52,
          description: 'Ramming Pile',
          FOB: '0.0475',
          CIF: '0.0520',
          CIF_total: 0,
          on_site_engineer: 75,
          on_site_engineer_included: true,
          notes: [
            'Number of exterior and interior tracker subject to the final layout design;',
            'The length of the post and Embedded Post Depth have been calculated on the basis of the geotechnical report received, it may changed after POT result and caculation;',
            'The Logistics cost in this offer are estimated at the date of the offer. The final cost of the Logistics will be subjected to the real cost upon contract execution.',
          ],
        },
        delivery_warranty: {
          incoterms_2010: 'FOB /CIF Casablanca',
          port_of_departure: 'QINGDAO',
          no_of_containers: '64  units 40HQ',
          first_delivery_lead_time: 'By negotiation',
          estimated_delivery_rate: 'By negotiation',
          steel_structural_components: '10 years',
          electro_mechanical_components: '7 years',
          galvanizing_protection: '10 years',
        },
        construction_spare_parts: {
          fasteners_spares: { percentage: 2, price: true, },
          up_structure_damper: { percentage: 0.2, price: true, },
          control_box_tcu: { percentage: 0.5, price: true, },
          post_others: { percentage: 0.5, price: true, },
          slew_drive_motor: { percentage: 0.2, price: true, },
          communication_box_ncu: { percentage: 5, price: true, },
        },
        //Item内容不写在tracker_supply中，而是写在模板上，可减少数据库保存时冗余
        //为了减少保存到数据库中数据量，将Item内容不写在数据中，而是在模板上处理，
        // 同时，将eset_scope简写为es,customer_scope简写为cs,optional简写为op,true简写为1,false简写为0
        tracker_supply: [
          { id: 1, es: 1, cs: 0, op: 0 },
          { id: 2, es: 1, cs: 0, op: 0 },
          { id: 3, es: 1, cs: 0, op: 0 },
          { id: 4, es: 1, cs: 0, op: 0 },
          { id: 5, es: 1, cs: 0, op: 0 },
          { id: 6, es: 1, cs: 0, op: 0 },
          { id: 7, es: 0, cs: 1, op: 0 },
          { id: 8, es: 0, cs: 1, op: 0 }
        ],
        Service: [
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
        ],
        service_extra_onsite_engineer_price: 230,
      }
  },
  filters: {
    filterChecked(value) {
      return value ? '√' : ''
    },
  },
}
</script>

<style lang="scss" scoped>
/* 版式：800×1130 成品框；正文基准约 13px */
$sq-brand: #113e8d;
$sq-text: #1a1a1a;
$sq-muted: #3d3d3d;
$sq-pad-x: 40px;
$sq-pad-y: 28px;
$sq-body: 13px;
$sq-line: 1.55;
$sq-callout-bg: #dbe9f5;
$sq-annex-bg: #d7dff0;
$sq-frame-divider: #c5cbd6;

/* ---- 布局与分页容器 ---- */
.container-seller-quotation {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.sq-pdf-toolbar {
  width: 100%;
  max-width: 800px;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.seller-quotation-frame+.seller-quotation-frame {
  margin-top: 24px;
  border-top: 1px solid $sq-frame-divider;
}

.seller-quotation-frame {
  width: 800px;
  height: 1130px;
  flex-shrink: 0;
  box-sizing: border-box;
  color: $sq-text;
  overflow: hidden;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: $sq-body;
  line-height: $sq-line;
}

.seller-quotation-frame--1 {
  background: #f5f7fb;
}

.seller-quotation-frame--2 {
  background: #f4f6fa;
}

.seller-quotation-frame--3 {
  background: #f6f5fa;
}

.sq-inner {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding: $sq-pad-y $sq-pad-x 32px;
}

/* ---- Page 1 封面 ---- */
.sq-inner--cover {
  padding-top: 22px;
}

.sq-cover-head {
  margin-bottom: 14px;
}

.sq-cover-logo {
  display: block;
  height: 48px;
  width: auto;
}

.sq-cover-hero {
  position: relative;
  width: 100%;
  margin-bottom: 18px;
}

.sq-cover-hero-img {
  display: block;
  width: 100%;
  height: auto;
  /* 极小分辨率占位图时避免 height:auto 把区域压成一条线，看起来像「图片没出来」 */
  min-height: 240px;
  object-fit: cover;
}

.sq-cover-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
  pointer-events: none;
}

.sq-cover-hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  padding: 16px 16px 52px;
}

.sq-cover-kicker {
  margin: 0 0 8px;
  color: #0a0a0a;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.2;
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.85),
    0 1px 2px rgba(255, 255, 255, 0.9),
    0 2px 6px rgba(0, 0, 0, 0.35);
}

.sq-cover-sub {
  margin: 0;
  color: #141414;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1.25;
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.8),
    0 1px 2px rgba(255, 255, 255, 0.85),
    0 2px 5px rgba(0, 0, 0, 0.3);
}

.sq-cover-meta {
  text-align: right;
  font-size: 12.5px;
  margin-bottom: 14px;
}

.sq-cover-meta p {
  margin: 2px 0;
}

.sq-link {
  color: $sq-brand;
  text-decoration: none;
}

.sq-link:hover {
  text-decoration: underline;
}

.sq-cover-company {
  margin: 0 0 18px;
  text-align: right;
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.35;
}

.sq-cover-body p {
  margin: 0 0 12px;
  font-size: $sq-body;
  color: $sq-muted;
  text-align: left;
}

.sq-cover-body p:last-child {
  margin-bottom: 0;
}

/* ---- 文档页眉（Frame 2 / 3） ---- */
.sq-doc-head {
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e2e2;
}

.sq-doc-logo {
  display: block;
  height: 40px;
  width: auto;
  margin-bottom: 10px;
}

.sq-doc-headline {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: $sq-brand;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ---- Frame 2：章节表格（table1–table5） ---- */
.seller-quotation-frame--2 .catalog {
  font-size: 10px;
}

.seller-quotation-frame--2 thead {
  background-color: $sq-callout-bg;
}

.seller-quotation-frame--2 td {
  font-size: 6px;
  height: 20px;
}

.seller-quotation-frame--2 .note {
  font-size: 6px;
  font-style: italic;
}

.sq-callout {
  background-color: $sq-callout-bg;
}

.sq-callout table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.sq-note-label-cell {
  width: 100px;
  text-align: center;
}

.sq-note-value-cell {
  width: auto;
  min-width: 0;
  vertical-align: top;
}

.sq-td-center {
  text-align: center;
}

.sq-td--tl {
  text-align: left;
}

.sq-price-head {
  text-align: center;
}

.sq-price-head--item {
  width: 280px;
}

.sq-price-head--std {
  width: 140px;
}

.sq-spacer--y6 {
  height: 6px;
}

.sq-td--w40 {
  width: 40px;
}

.sq-td--w100 {
  width: 100px;
}

.sq-td--w200 {
  width: 200px;
}

.sq-td--w240 {
  width: 240px;
}

.sq-td--w300 {
  width: 300px;
}

.sq-td--w400 {
  width: 400px;
}

.sq-td--w500 {
  width: 500px;
}

.sq-td--w600 {
  width: 600px;
}

.sq-td--w700 {
  width: 700px;
}

/* ---- Frame 3：Annex 表格 ---- */
.sq-annex-panel {
  text-align: center;
  background-color: $sq-annex-bg;
}

.sq-annex-table {
  width: 100%;
  border-collapse: collapse;
}

.sq-annex-col-no {
  width: 3%;
}

.sq-annex-col-tag {
  width: 12%;
}

.sq-td-index {
  font-weight: bold;
}

.sq-annex-scope-cell {
  cursor: pointer;
  user-select: none;
  text-align: center !important;
  min-width: 48px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #ecf5ff;
  }
}

.seller-quotation-frame--3 thead {
  background-color: $sq-callout-bg;
  font-size: 16px;
  color: #000;
}

.seller-quotation-frame--3 tbody tr {
  height: 36px;
}

.seller-quotation-frame--3 tbody tr td {
  text-align: left;
  color: #000;
  font-size: 12px;
  border: 1px solid #fdfdfd;
}

.seller-quotation-frame--3 tbody tr td.sq-td-center {
  text-align: center;
}

.seller-quotation-frame--3 tbody tr td.sq-td-index {
  text-align: left;
}
</style>
