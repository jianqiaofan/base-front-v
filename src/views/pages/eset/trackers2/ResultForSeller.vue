<template>
  <div class="resultforseller-container scrollable-div">
    <div
      class="head-title"
      :class="{ 'head-title--dragging': headTitleDrag.active }"
      :style="headTitlePanelStyle"
    >
      <div
        class="head-title__drag-bar"
        title="拖动移动面板"
        @mousedown.stop.prevent="onHeadTitleDragStart"
      >
        <span class="head-title__eco-icon" aria-hidden="true" />
        <span class="head-title__badge">{{ lgc ? '方案摘要' : 'Plan' }}</span>
        <span class="head-title__hint">{{ lgc ? '拖拽移动' : 'Drag' }}</span>
      </div>
      <div class="head-title__body">
        <p>{{ lgc ? '当前用户' : 'USER' }}：{{ name }}</p>
        <p>{{ tsl.project_code[lgc] }}：{{ theProjectAndPlanObj.project_code }}</p>
        <p>{{ tsl.project_name[lgc] }}：{{ theProjectAndPlanObj.project_name }}</p>
        <p>{{ tsl.plan_description[lgc] }}：{{ theProjectAndPlanObj.plan_description }}</p>
        <p>{{ tsl.sale_manager[lgc] }}：{{ theProjectAndPlanObj.seller }}</p>
        <p>{{ tsl.designer[lgc] }}：{{ theProjectAndPlanObj.designer }}</p>
      </div>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">项目成本价 Project Cost Price</span>
          </div>
        </template>
        <div class="summary-plan-table" style="margin-left: 20px">
          <!--    {{planResult}}-->
          <el-table :data="planResult.summaryData || []" border stripe class="summary-plan-table__grid"
            style="width: 1800px" :row-class-name="summaryPlanRowClassName" :cell-class-name="summaryPlanCellClassName">
            <el-table-column type="index" label="序号" width="50" align="center" header-align="center"
              :index="summaryPlanIndexMethod"></el-table-column>
            <el-table-column prop="trackBrifeName" label="型号" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="trackerNum" label="数量(套)" width="80" align="center"
              header-align="center"></el-table-column>
            <el-table-column prop="trackerNumRatio" label="占比%" width="70" align="right" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="pvCapacity" label="组件容量(W)" width="120" align="center" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="solarList" label="组件排布" width="120" align="center" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="trackerWeightSpare" label="单套重量(kg)" width="120" align="right" header-align="center"
              :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerCapacity" label="容量(kW)" width="80" align="right" header-align="center"
              :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerTotalWeightSpare" label="总重量(kg)" width="120" align="right"
              header-align="center" :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerTotalWeightOnlyStructureSpare" width="120" align="right" header-align="center"
              :formatter="formatNumber3">
              <template #header>
                <div class="summary-plan-table__header-multiline">
                  <div>总重量</div>
                  <div class="summary-plan-table__header-sub">(不含机械电气)</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="trackerTotalCapacity" label="总容量(kW)" width="120" align="right" header-align="center"
              :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerPriceSpare" label="单套价格" width="120" align="right" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="trackerTotalPriceSpare" label="总价格" width="150" align="right" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="pricePerWattSpare" label="瓦单价" width="110" align="right" header-align="center"
              :formatter="formatNumber6"></el-table-column>
          </el-table>
          <p style="color: red">* 单套重量、总重量、单套价格、总价格、瓦单价均是含有备品备件的数据</p>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">材料费 Material Cost</span>
          </div>
        </template>
        <div>
          <el-table :data="materialFee" border style="width: 1200px">
            <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="name" label="材料名称" width="100"></el-table-column>
            <el-table-column prop="totalPrice" label="总价" width="200" :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="pricePerWatt" label="瓦单价" width="200" :formatter="formatNumber6"></el-table-column>
            <el-table-column prop="totalWeight" label="总重" width="200" :formatter="formatNumber6"></el-table-column>
            <el-table-column prop="tonPerMw" label="兆瓦吨重" width="200" :formatter="formatNumber6"></el-table-column>
            <el-table-column prop="processingSite" label="生产地" width="100"></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">运输费、利润 Transportation costs and profits</span>
          </div>
        </template>
        <h3>汇率换算</h3>
        <div class="fee-div">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="美元汇率$">
              <el-input v-model="form.exchange_rate_usd" placeholder="美元汇率" style="width:72px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="欧元汇率€" style="margin-left: 10px">
              <el-input v-model="form.exchange_rate_eur" placeholder="欧元汇率" style="width:72px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="兑换手续费" style="margin-left: 10px">
              <el-input v-model="form.exchange_rate_handling_fee" placeholder="兑换手续费" style="width:60px;"
                size="mini"></el-input>
            </el-form-item>
            <el-form-item label="%"></el-form-item>
            <el-form-item>
              <span class="summary-exchange-btns">
                <el-button type="success" size="mini" @click="getExchangeRate"
                  :loading="exchangeRateLoading">刷新汇率</el-button>
                <el-button type="primary" size="mini" @click="openBocExchangePage">外汇牌价</el-button>
              </span>
            </el-form-item>
          </el-form>
          <p class="exchange-note">* 输入币种说明：¥-人民币,$-美元,€-欧元</p>
        </div>

        <h3>运费、税费等与生产地有关的费用</h3>
        <div class="fee-div" v-for="psd in (form.process_site || [])" :key="psd.location || psd.id">
          <el-form :inline="true" class="demo-form-inline">
            <p class="prosite">
              <span>
                <i class="el-icon-location-outline"></i> 生产地：
                <span class="location-tag">{{ psd.location }}</span>
              </span>
              <span>
                <i class="el-icon-money"></i> 总货值：
                <span class="value">{{ psd.goodTotalPrice }}</span> 元(¥)
              </span>
              <span>
                <i class="el-icon-ship"></i> 总货重：
                <span class="value">{{ psd.goodTotalWeight / 1000 }}</span> 吨
              </span>
            </p>
          </el-form>

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="生产工厂到港口运费单价">
              <el-select v-model="psd.method" placeholder="请选择" style="width:100px;" size="mini">
                <el-option label="散装" value="bulk"></el-option>
                <el-option label="整运" value="container"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运费单价" style="margin-left: 20px">
              <el-input v-show="psd.method === 'bulk'" v-model="psd.bulk_unit_price" placeholder="每吨运费单价"
                style="width:80px;" size="mini"></el-input>
              <el-input v-show="psd.method === 'container'" v-model="psd.container_unit_price" placeholder="每集装箱运费单价"
                style="width:80px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item v-show="psd.method === 'container'" label="(¥/集装箱)"></el-form-item>
            <el-form-item v-show="psd.method === 'bulk'" label="(¥/吨)"></el-form-item>
            <el-form-item label="集装箱限重">
              <el-input v-model="psd.container_limit_weight" placeholder="" style="width:60px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="吨"></el-form-item>
          </el-form>

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="生产国出口海运费">
              <el-input v-model="psd.unit_ocean_freight" placeholder="每箱运费(按美元计价)" style="width:100px"
                size="mini"></el-input>
              <el-form-item label="($/箱)" style="margin-left: 6px"></el-form-item>
            </el-form-item>
            <el-form-item label="目地国港杂+派送费单价">
              <el-input v-model="psd.import_port_fees" placeholder="目地国港杂+派送费" style="width:100px"
                size="mini"></el-input>
              <el-form-item label="($/吨)" style="margin-left: 6px"></el-form-item>
            </el-form-item>
          </el-form>

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="项目所在国关税">
              <el-switch v-model="psd.switch_tariff" active-text="有关税" inactive-text="无关税">
              </el-switch>
              <el-form-item v-show="psd.switch_tariff" label="关税税率" style="margin-left: 18px"></el-form-item>
              <el-input v-show="psd.switch_tariff" v-model="psd.tariff_rate" placeholder="关税税率" style="width:100px"
                size="mini"></el-input>
              <el-form-item v-show="psd.switch_tariff" label="(%)" style="margin-left: 6px"></el-form-item>
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="生产国出口退税">
              <el-switch v-model="psd.switch_tax_refund" active-text="有退税" inactive-text="无退税">
              </el-switch>
              <el-form-item v-show="psd.switch_tax_refund" label="退税税率" style="margin-left: 18px"></el-form-item>
              <el-input v-show="psd.switch_tax_refund" v-model="psd.tax_refund_rate" placeholder="退税税率"
                style="width:100px" size="mini"></el-input>
              <el-form-item v-show="psd.switch_tax_refund" label="(%)" style="margin-left: 6px"></el-form-item>
            </el-form-item>
          </el-form>

        </div>
        <h3>其它费用</h3>
        <div class="fee-div">
          <el-form class="other-fee-form" label-width="120px">
            <el-form-item label="安装指导费">
              <el-switch v-model="form.guide_fee_switch" active-text="有" inactive-text="无">
              </el-switch>
              <el-input
                v-show="form.guide_fee_switch"
                v-model="form.guide_fee"
                placeholder="安装指导费"
                style="width:80px; margin-left: 10px"
                size="mini"
              ></el-input>
              <span v-show="form.guide_fee_switch" class="other-fee-form__unit">($/day)</span>
              <span v-show="form.guide_fee_switch" class="other-fee-form__hint">共{{ form.guide_days }}天</span>
            </el-form-item>
            <el-form-item label="保函和财务费">
              <el-switch v-model="form.guarantee_and_financial_fees_switch" active-text="有" inactive-text="无">
              </el-switch>
              <el-input
                v-show="form.guarantee_and_financial_fees_switch"
                v-model="form.guarantee_and_financial_fees"
                placeholder="财务费等"
                style="width:130px; margin-left: 10px"
                size="mini"
              ></el-input>
              <span v-show="form.guarantee_and_financial_fees_switch" class="other-fee-form__unit">(¥)</span>
            </el-form-item>
            <el-form-item label="第三方审核费">
              <el-switch v-model="form.third_party_audit_fee_switch" active-text="有" inactive-text="无">
              </el-switch>
              <el-input
                v-show="form.third_party_audit_fee_switch"
                v-model="form.third_party_audit_fee"
                placeholder="第三方审核费"
                style="width:130px; margin-left: 10px"
                size="mini"
              ></el-input>
              <span v-show="form.third_party_audit_fee_switch" class="other-fee-form__unit">(¥)</span>
            </el-form-item>
          </el-form>
        </div>


        <h3>毛利率与运输条款</h3>
        <div style="width: 1600px">
          <el-table height="600px" :data="basicPrice" border stripe size="small" style="width: 1200px">
            <el-table-column prop="margin" label="Margin" width="80px" fixed="left"></el-table-column>
            <el-table-column prop="rmb_exw" label="rmb_exw" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="rmb_fob" label="rmb_fob" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="rmb_cif" label="rmb_cif" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="rmb_dap" label="rmb_dap" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="rmb_ddp" label="rmb_ddp" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="usd_exw" label="usd_exw" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="usd_fob" label="usd_fob" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="usd_cif" label="usd_cif" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="usd_dap" label="usd_dap" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="usd_ddp" label="usd_ddp" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="eur_exw" label="eur_exw" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="eur_fob" label="eur_fob" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="eur_cif" label="eur_cif" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="eur_dap" label="eur_dap" width="90px" :formatter="formatNumber4"></el-table-column>
            <el-table-column prop="eur_ddp" label="eur_ddp" width="90px" :formatter="formatNumber4"></el-table-column>
          </el-table>

        </div>
        <div>
          <p>贸易术语名称解释：</p>
          <p>EXW：(Ex
            Works),代表“离厂价”或“工厂交货”。卖方只需在工厂（或其他指定地点）准备好货物，并提供必要的出口文件，如商业发票、装箱单等。而买方则需负责从卖方指定的地点自行提货，并承担此后的所有运输、清关、税费和保险等费用。
          </p>
          <p>FOB:(Free On
            Board),“离岸价”或“船上交货价”，指卖方在约定装运港将货物装上买方指定船只并完成出口手续，买方负责租船订舱及货物装船后的运输与保险。</p>
          <p>CIF:(Cost,Insurance and Freight),成本加保险费加运费。</p>
          <p>DAP:(delivered at
            place),目的地交货，是指卖方已经用运输工具把货物运送到达买方指定的目的地后，将装在运输工具上的货物（不用卸载）交由买方处置。</p>
          <p>DDP:(Delivered Duty
            Paid),需要由卖方办理进口清关手续的术语，卖方需承担将货物运至指定目的地的一切风险和费用，包括在目的地应交纳的关税、税款及其他费用。</p>
        </div>
      </el-collapse-item>


    </el-collapse>


  </div>

</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'ResultForSeller',
  data() {
    return {
      activeNames: ['3'],
      form: {},
      exchangeRateLoading: false,
      lgc: 1,
      tsl: {
        project_code: ['Project Code', '项目编号'],
        project_name: ['Project Name', '项目名称'],
        plan_description: ['Plan Description', '方案名称'],
        sale_manager: ['Sale Manager', '销售经理'],
        designer: ['Designer', '设计师']
      },
      headTitlePos: { left: 0, top: 600 },
      headTitleDrag: {
        active: false,
        startX: 0,
        startY: 0,
        originLeft: 0,
        originTop: 0
      }
    }
  },
  computed: {
    ...mapGetters(['name']),
    theProjectAndPlanObj() {
      const src = this.projectAndPlan || {}
      return {
        project_code: src.project_code || '',
        project_name: src.project_name || '',
        plan_description: src.plan_description || '',
        seller: src.seller || '',
        designer: src.designer || ''
      }
    },
    headTitlePanelStyle() {
      return {
        left: `${this.headTitlePos.left}px`,
        top: `${this.headTitlePos.top}px`
      }
    },
    planTotalCapacity() {
      if (!this.planResult) return undefined
      return this.planResult.planCapacity  //总容量，到处都要用到
    },
    materialFee() {
      return this.materialFeeAndWeight(this.planResult)
    },
    basicPrice() {
      const processSite = this.form && this.form.process_site
      if (!Array.isArray(processSite) || processSite.length === 0) {
        return []
      }
      let capacity = this.planTotalCapacity

      if (capacity === undefined || capacity.isNaN || capacity === 0) {
        capacity = 1
      }
      let siteCosts = []
      processSite.forEach(s => {
        if (s.container_limit_weight === 0) {
          s.container_limit_weight = 1
        }
        let containerCount = Math.ceil(0.001 * s.goodTotalWeight / s.container_limit_weight)  //集装箱个数
        console.log('集装柜个数', containerCount)
        let obj = {
          location: s.location,
          material_cost: s.goodTotalPrice,
          delivery_process_site: s.method === 'container' ? containerCount * s.container_unit_price : 0.001 * s.goodTotalWeight * s.bulk_unit_price,
          delivery_sea: containerCount * s.unit_ocean_freight * this.form.exchange_rate_usd,
          delivery_project_site: 0.001 * s.goodTotalWeight * s.import_port_fees * this.form.exchange_rate_usd,
          tariff: s.switch_tariff ? s.goodTotalPrice * 0.01 * s.tariff_rate : 0,
          tax_refund: s.switch_tax_refund ? s.goodTotalPrice * (1 - 1 / (1 + 0.01 * s.tax_refund_rate)) : 0
        }
        siteCosts.push(obj)
      })
      const material_cost = siteCosts.reduce((a, b) => a + 1 * b.material_cost, 0)  //材料费
      const delivery_process_site = siteCosts.reduce((a, b) => a + 1 * b.delivery_process_site, 0)  //生产国运费
      const delivery_sea = siteCosts.reduce((a, b) => a + 1 * b.delivery_sea, 0)  //运费(海运)
      const delivery_project_site = siteCosts.reduce((a, b) => a + 1 * b.delivery_project_site, 0)  //运费(目地国)
      const tariff = siteCosts.reduce((a, b) => a + 1 * b.tariff, 0)  //进口关税
      const tax_refund = siteCosts.reduce((a, b) => a + 1 * b.tax_refund, 0)  //出口退税
      const guide_fee = this.form.guide_fee_switch ? this.form.guide_fee * this.form.guide_days * this.form.exchange_rate_usd :0 //安装指导
      const guarantee_and_financial_fees = this.form.guarantee_and_financial_fees_switch ? 1 * this.form.guarantee_and_financial_fees :0  //保函等财务费用
      const third_party_audit_fee = this.form.third_party_audit_fee_switch ? 1 * this.form.third_party_audit_fee :0  //第三方审核费
      let usd = this.form.exchange_rate_usd * (1 + 0.01 * this.form.exchange_rate_handling_fee)
      let eur = this.form.exchange_rate_eur * (1 + 0.01 * this.form.exchange_rate_handling_fee)
      let marginTable = []
      for (let margin = 0; margin < 31; margin++) {
        let rmb_exw = (material_cost - tax_refund) / (1 - 0.01 * margin) + guide_fee + guarantee_and_financial_fees + third_party_audit_fee
        let rmb_fob = rmb_exw + delivery_process_site  //只含生产地运费
        let rmb_cif = rmb_exw + delivery_process_site + delivery_sea  //含生产地运费，海上运费
        let rmb_dap = rmb_exw + delivery_process_site + delivery_sea + delivery_project_site //含全部三段运费
        let rmb_ddp = rmb_dap + tariff  //含税
        marginTable.push({
          margin: margin,
          rmb_exw: rmb_exw / capacity,
          rmb_fob: rmb_fob / capacity,
          rmb_cif: rmb_cif / capacity,
          rmb_dap: rmb_dap / capacity,
          rmb_ddp: rmb_ddp / capacity,
          usd_exw: rmb_exw / (capacity * usd),
          usd_fob: rmb_fob / (capacity * usd),
          usd_cif: rmb_cif / (capacity * usd),
          usd_dap: rmb_dap / (capacity * usd),
          usd_ddp: rmb_ddp / (capacity * usd),
          eur_exw: rmb_exw / (capacity * eur),
          eur_fob: rmb_fob / (capacity * eur),
          eur_cif: rmb_cif / (capacity * eur),
          eur_dap: rmb_dap / (capacity * eur),
          eur_ddp: rmb_ddp / (capacity * eur),
        })
      }
      console.log('总容量', capacity)
      console.log('材料总价', material_cost)
      console.log('国内运费', delivery_process_site)
      console.log('海上运费', delivery_sea)
      console.log('国外运费', delivery_project_site)
      console.log('关税', tariff)
      console.log('退税', tax_refund)
      console.log('指导费', guide_fee)
      console.log('财务费', guarantee_and_financial_fees)
      console.log('第三方审核费', third_party_audit_fee)
      console.log(marginTable)
      return marginTable
    }
  },

  methods: {
    initHeadTitlePosition() {
      const panelW = 420
      const margin = 12
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
      this.headTitlePos = {
        left: Math.max(margin, vw - panelW - margin),
        top: 600
      }
    },
    onHeadTitleDragStart(e) {
      this.headTitleDrag.active = true
      this.headTitleDrag.startX = e.clientX
      this.headTitleDrag.startY = e.clientY
      this.headTitleDrag.originLeft = this.headTitlePos.left
      this.headTitleDrag.originTop = this.headTitlePos.top
      document.addEventListener('mousemove', this.onHeadTitleDragMove)
      document.addEventListener('mouseup', this.onHeadTitleDragEnd)
    },
    onHeadTitleDragMove(e) {
      if (!this.headTitleDrag.active) return
      const dx = e.clientX - this.headTitleDrag.startX
      const dy = e.clientY - this.headTitleDrag.startY
      const panelW = 420
      const m = 8
      let left = this.headTitleDrag.originLeft + dx
      let top = this.headTitleDrag.originTop + dy
      const maxL = window.innerWidth - panelW - m
      const maxT = window.innerHeight - 56
      left = Math.min(Math.max(m, left), Math.max(m, maxL))
      top = Math.min(Math.max(m, top), Math.max(m, maxT))
      this.headTitlePos = { left, top }
    },
    onHeadTitleDragEnd() {
      if (!this.headTitleDrag.active) return
      this.headTitleDrag.active = false
      document.removeEventListener('mousemove', this.onHeadTitleDragMove)
      document.removeEventListener('mouseup', this.onHeadTitleDragEnd)
    },
    onHeadTitleViewportResize() {
      const panelW = 420
      const m = 8
      const maxL = Math.max(m, window.innerWidth - panelW - m)
      this.headTitlePos.left = Math.min(this.headTitlePos.left, maxL)
      this.headTitlePos.top = Math.min(this.headTitlePos.top, Math.max(m, window.innerHeight - 80))
    },
    //初始化要输入内容
    initForm(planResult) {
      if (!planResult || typeof planResult !== 'object') {
        this.form = {
          exchange_rate_usd: 6.823,
          exchange_rate_eur: 7.9816,
          exchange_rate_handling_fee: 1.5,
          guide_fee: 200,
          guide_days: 25,
          guarantee_and_financial_fees: 0,
          third_party_audit_fee: 0,
          guide_fee_switch: true,
          guarantee_and_financial_fees_switch: true,
          third_party_audit_fee_switch: true,
          process_site: []
        }
        return
      }
      this.form = {
        exchange_rate_usd: 6.823,
        exchange_rate_eur: 7.9816,
        exchange_rate_handling_fee: 1.5,
        guide_fee: 200,
        guide_days: this.getDayOfService(planResult.planCapacity),
        guarantee_and_financial_fees: 0,
        third_party_audit_fee: 0,
        guide_fee_switch: true,
        guarantee_and_financial_fees_switch: true,
        third_party_audit_fee_switch: true,
        process_site: this.getProcessSiteInfo(planResult)
      }
    },
    //获取按生地和货种区分的材料费和重量
    materialFeeAndWeight(plan) {
      let mf = []
      if (plan !== undefined && plan.trackersInfo !== undefined && plan.trackersInfo.length > 0) {
        const totalCapacity = plan.planCapacity
        const prt = plan.trackersInfo
        prt.forEach(t => {
          t.trackTotalPostPriceSpare = t.resultList.bom1.filter(b => b.productCategory === 'Post').reduce((a, b) => a + b.totalPriceSpare, 0) * t.trackerNum  //计算单个支架立柱总金额
          t.trackTotalPostWeightSpare = t.resultList.bom1.filter(b => b.productCategory === 'Post').reduce((a, b) => a + b.totalWeightSpare, 0) * t.trackerNum //计算单个支架立柱总重
          t.trackTotalBeamPriceSpare = t.resultList.bom1.filter(b => b.productCategory === 'Torque Tube').reduce((a, b) => a + b.totalPriceSpare, 0) * t.trackerNum  //计算单个支架主梁总金额
          t.trackTotalBeamWeightSpare = t.resultList.bom1.filter(b => b.productCategory === 'Torque Tube').reduce((a, b) => a + b.totalWeightSpare, 0) * t.trackerNum  //计算单个支架主梁总重
          t.trackTotalPurlinPriceSpare = t.resultList.bom1.filter(b => b.productCategory === 'Purlin').reduce((a, b) => a + b.totalPriceSpare, 0) * t.trackerNum //计算单个支架檩条总金额
          t.trackTotalPurlinWeightSpare = t.resultList.bom1.filter(b => b.productCategory === 'Purlin').reduce((a, b) => a + b.totalWeightSpare, 0) * t.trackerNum  //计算单个支架檩条总重
          t.trackTotalOtherPriceSpare = t.resultList.bom1.filter(b => !['Post', 'Torque Tube', 'Purlin'].includes(b.productCategory)).reduce((a, b) => a + b.totalPriceSpare, 0) * t.trackerNum  //计算单个支架其它总金额
          t.trackTotalOtherWeightSpare = t.resultList.bom1.filter(b => !['Post', 'Torque Tube', 'Purlin'].includes(b.productCategory)).reduce((a, b) => a + b.totalWeightSpare, 0) * t.trackerNum  //计算单个支架其它总重
        })
        mf = [
          {
            name: '立柱',
            totalPrice: prt.reduce((a, b) => a + b.trackTotalPostPriceSpare, 0),
            totalWeight: prt.reduce((a, b) => a + b.trackTotalPostWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalPostPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalPostWeightSpare, 0) / totalCapacity,
            processingSite: plan.process_site.post
          },
          {
            name: '主梁',
            totalPrice: prt.reduce((a, b) => a + b.trackTotalBeamPriceSpare, 0),
            totalWeight: prt.reduce((a, b) => a + b.trackTotalBeamWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalBeamPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalBeamWeightSpare, 0) / totalCapacity,
            processingSite: plan.process_site.beam
          },
          {
            name: '檩条',
            totalPrice: prt.reduce((a, b) => a + b.trackTotalPurlinPriceSpare, 0),
            totalWeight: prt.reduce((a, b) => a + b.trackTotalPurlinWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalPurlinPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalPurlinWeightSpare, 0) / totalCapacity,
            processingSite: plan.process_site.purlin
          },
          {
            name: '其它',
            totalPrice: prt.reduce((a, b) => a + b.trackTotalOtherPriceSpare, 0) + plan.weatherStationTotalPrice,
            totalWeight: prt.reduce((a, b) => a + b.trackTotalOtherWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalOtherPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalOtherWeightSpare, 0) / totalCapacity,
            processingSite: '国内'
          }
        ]
      }
      return mf
    },
    //计算标准服务天数
    getDayOfService(totalCapacity) {
      const capacity = 0.000001 * totalCapacity
      let days = 0
      if (capacity < 1) {
        days = 25
      } else if (capacity < 5) {
        days = 35
      } else if (capacity < 10) {
        days = 35
      } else if (capacity < 20) {
        days = 55
      } else if (capacity < 50) {
        days = 75
      } else if (capacity < 80) {
        days = 100
      } else if (capacity < 150) {
        days = 140
      } else if (capacity < 300) {
        days = 180
      } else if (capacity < 500) {
        days = 230
      } else if (capacity < 750) {
        days = 300
      } else if (capacity < 1000) {
        days = 400
      } else {
        days = Math.floor(400 * capacity / 1000)
      }
      return days
    },
    //获取不同发货地的信息
    getProcessSiteInfo(plan) {
      let mc = this.materialFee
      console.log('mc============================')
      console.log(mc)
      let sites = Array.from(new Set([...mc.map(m => m.processingSite)]))
      console.log(sites)
      let r = []
      sites.forEach(site => {
        let obj = {
          location: site,
          method: 'container',
          goodTotalPrice: mc.filter(m => m.processingSite === site).reduce((a, b) => 1 * a + 1 * b.totalPrice, 0).toFixed(2),
          goodTotalWeight: mc.filter(m => m.processingSite === site).reduce((a, b) => 1 * a + b.totalWeight, 0).toFixed(3),
          container_unit_price: 5500,
          container_limit_weight: 22,
          bulk_unit_price: 250,
          unit_ocean_freight: 2200,
          import_port_fees: 100,
          switch_tariff: true,
          switch_tax_refund: true,
          tariff_rate: 7,
          tax_refund_rate: 13
        }
        r.push(obj)
      })
      return r
    },
    /**
     * 获取美元和欧元即期汇率的现汇买入价
     * @returns {Promise<void>}
     */
    getExchangeRate() {
      this.exchangeRateLoading = true
      fetch(process.env.VUE_APP_BASE_API + '/api/getExchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: {}
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          let rates = r.data.replace('}', ',}')
          this.form.exchange_rate_usd = (rates.split('usd:')[1].split(',')[0] / 100).toFixed(4)
          this.form.exchange_rate_eur = (rates.split('eur:')[1].split(',')[0] / 100).toFixed(4)
          this.exchangeRateLoading = false
        })
        .catch(error => {
          console.error('Error:', error)
          this.exchangeRateLoading = false
        })
    },
    openBocExchangePage() {
      window.open('https://www.boc.cn/sourcedb/whpj/', '_blank')
    },
    handleChange(val) {
      // console.log(val);
    },
    onSubmit() {
      // console.log(val);
    },
    indexMethod(index) {
      return index + 1
    },
    /** 项目成本价汇总表：合计 / 气象站行样式（与 planUtils.summaryData 一致） */
    summaryPlanRowClassName({ row }) {
      if (!row) return ''
      if (row.trackBrifeName === '合计') {
        return 'summary-plan-table__row-total'
      }
      if (row.trackBrifeName === 'weather station') {
        return 'summary-plan-table__row-weather'
      }
      return ''
    },
    /** 合计行瓦单价单元格单独加类，便于特强调样式 */
    summaryPlanCellClassName({ row, column }) {
      if (!row || !column) return ''
      if (row.trackBrifeName === '合计' && column.property === 'pricePerWattSpare') {
        return 'summary-plan-table__cell-total-price-per-watt'
      }
      return ''
    },
    /** 合计行序号不显示递增数字 */
    summaryPlanIndexMethod(index) {
      const rows = this.planResult && this.planResult.summaryData
      if (rows && rows[index] && rows[index].trackBrifeName === '合计') {
        return '—'
      }
      return index + 1
    },
    formatNumber2(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(2)
        }
      } else {
        return cellValue
      }
    },
    formatNumber3(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(3)
        }
      } else {
        return cellValue
      }
    },
    formatNumber4(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(4)
        }
      } else {
        return cellValue
      }
    },
    formatNumber6(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return cellValue // 如果是整数，直接返回该数字
        } else {
          return cellValue.toFixed(6)
        }
      } else {
        return cellValue
      }
    },
    formatSpecification(row, column, cellValue) {
      if (['04', '05', '06'].includes(row.priceId.substring(0, 2))) {
        return ''
      } else {
        return cellValue
      }
    }
  },
  mounted() {
    this.initForm(this.planResult)
    this.initHeadTitlePosition()
    window.addEventListener('resize', this.onHeadTitleViewportResize)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onHeadTitleDragMove)
    document.removeEventListener('mouseup', this.onHeadTitleDragEnd)
    window.removeEventListener('resize', this.onHeadTitleViewportResize)
  },
  props: {
    planResult: {
      type: Object,
      default: () => ({})
    },
    projectAndPlan: {
      type: Object,
      default: () => ({})
    }
  }

}
</script>

<style scoped>
.resultforseller-container {
  position: relative;
  text-align: left;
  max-width: 100%;
  /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto;
  /* 当内容宽度超过容器宽度时显示水平滚动条 */
  overflow-y: scroll;
}

.scrollable-div {
  height: 1260px;
  padding-left: 20px;
  padding-bottom: 600px;
  overflow-y: scroll;
}

.fee-div {
  margin-top: 20px;
  width: 800px;
  padding: 20px 25px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  /* 商务淡蓝渐变 */
  border-radius: 8px;
  border-left: 4px solid #409EFF;
  /* 左侧蓝色条，起到视觉强调作用 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 汇率区两个 mini 按钮等高对齐 */
.summary-exchange-btns {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  vertical-align: middle;
}

.summary-exchange-btns ::v-deep .el-button--mini {
  margin: 0;
  height: 28px;
  padding: 7px 15px;
  line-height: 1;
  box-sizing: border-box;
}

/* 其它费用：每项独占一行 */
.other-fee-form ::v-deep .el-form-item {
  display: block;
  margin-bottom: 14px;
}

.other-fee-form ::v-deep .el-form-item:last-child {
  margin-bottom: 0;
}

.other-fee-form__unit,
.other-fee-form__hint {
  margin-left: 8px;
  font-size: 12px;
  color: #606266;
}

.prosite {
  border-bottom: 2px dashed #dcdfe6;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
  display: flex;
  gap: 20px;
  /* 项与项之间的间距 */
}

.prosite strong {
  color: #f56c6c;
  /* 如果你依然想保留警示感，可以用柔和的珊瑚红 */
  font-size: 16px;
  margin-left: 5px;
}

.exchange-note {
  margin-top: 12px;
  padding-left: 5px;
  font-size: 12px;
  color: #7f8c8d;
  /* 优雅的灰绿色 */
  font-style: italic;
  /* 斜体增加脚注感 */
  display: flex;
  align-items: center;
}

.exchange-note::before {
  content: 'ℹ️';
  /* 或者使用 Element UI 的图标 el-icon-info */
  margin-right: 6px;
  font-style: normal;
  font-size: 14px;
}

/* 项目成本价汇总表：层次与可读性 */
.summary-plan-table {
  padding-bottom: 4px;
}

.summary-plan-table__grid {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.summary-plan-table__header-multiline {
  text-align: center;
  line-height: 1.35;
  font-weight: 600;
}

.summary-plan-table__header-sub {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.summary-plan-table__grid ::v-deep .el-table th {
  background: linear-gradient(180deg, #f0f4f8 0%, #e4ebf2 100%);
  color: #303133;
  font-weight: 600;
  padding: 10px 0;
}

.summary-plan-table__grid ::v-deep .el-table td {
  padding: 10px 0;
  font-variant-numeric: tabular-nums;
}

.summary-plan-table__grid ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafbfc;
}

.summary-plan-table__grid ::v-deep .el-table__body tr:hover>td {
  background-color: #ecf5ff !important;
}

/* 型号列略强调，便于横向对照 */
.summary-plan-table__grid ::v-deep .el-table__body td:nth-child(2) {
  font-weight: 500;
  color: #303133;
}

/* 含备品备件的价格列与下方注释呼应 */
.summary-plan-table__grid ::v-deep .el-table__header-wrapper thead th:nth-last-child(-n + 3) {
  background: linear-gradient(180deg, #fdf6ec 0%, #f8ecd4 100%);
  color: #a67c32;
}

.summary-plan-table__grid ::v-deep .el-table__body-wrapper tbody td:nth-last-child(-n + 3) {
  background-color: #fffbf5;
}

.summary-plan-table__grid ::v-deep .el-table__body-wrapper tbody tr.el-table__row--striped td:nth-last-child(-n + 3) {
  background-color: #fdf6ec;
}

.summary-plan-table__grid ::v-deep .el-table__body-wrapper tbody tr:hover>td:nth-last-child(-n + 3) {
  background-color: #faecd8 !important;
}

/* 气象站 weather station 行：与明细行区分（planUtils 中 trackBrifeName === 'weather station'） */
.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-weather>td {
  background: linear-gradient(90deg, #e8f5e9 0%, #f1f8f0 18%, #f5faf6 100%) !important;
  color: #455a64;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-weather>td:first-child {
  box-shadow: inset 3px 0 0 #67c23a;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-weather>td:nth-last-child(-n + 3) {
  background: linear-gradient(90deg, #edf6ee 0%, #f4faf4 22%, #f6fbf7 100%) !important;
  color: #455a64;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-weather:hover>td,
.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-weather:hover>td:nth-last-child(-n + 3) {
  background: linear-gradient(90deg, #dceddf 0%, #e8f5ea 100%) !important;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-weather>td:nth-child(2) {
  font-style: italic;
  font-weight: 600;
  color: #529b2e !important;
}

/* 合计行（数据末尾 trackBrifeName === '合计'）着重显示 */
.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total>td {
  background: linear-gradient(180deg, #d9ecff 0%, #c5ddf5 100%) !important;
  font-weight: 700 !important;
  color: #1f2d3d !important;
  font-size: 14px;
  border-top: 2px solid #409eff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total>td:nth-last-child(-n + 3) {
  background: linear-gradient(180deg, #d4eaff 0%, #bedaf3 100%) !important;
  color: #1f2d3d !important;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total:hover>td,
.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total:hover>td:nth-last-child(-n + 3) {
  background: linear-gradient(180deg, #cce4f9 0%, #b8d4f0 100%) !important;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total>td:nth-child(2) {
  font-size: 15px;
  letter-spacing: 0.05em;
  color: #409eff !important;
}

/* 合计行：瓦单价列内容特强调 */
.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total>td.summary-plan-table__cell-total-price-per-watt {
  background: linear-gradient(180deg, #fff7e6 0%, #ffeccd 100%) !important;
  color: #c45606 !important;
  font-size: 17px !important;
  font-weight: 800 !important;
  letter-spacing: 0.02em;
  box-shadow: inset 0 0 0 1px #e6a23c, inset 0 -2px 0 rgba(196, 86, 6, 0.35) !important;
  font-variant-numeric: tabular-nums;
}

.summary-plan-table__grid ::v-deep tr.summary-plan-table__row-total:hover>td.summary-plan-table__cell-total-price-per-watt {
  background: linear-gradient(180deg, #ffefd0 0%, #ffe0b3 100%) !important;
  color: #a34405 !important;
}

/* 方案摘要浮层（与 TrackerIndex 一致，可拖拽） */
.head-title {
  position: fixed;
  width: 420px;
  right: auto;
  z-index: 2000;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(
    155deg,
    rgba(125, 211, 252, 0.5) 0%,
    rgba(56, 189, 248, 0.5) 45%,
    rgba(14, 165, 233, 0.5) 100%
  );
  border: 1px solid rgba(2, 132, 199, 0.5);
  box-shadow:
    0 12px 40px rgba(14, 165, 233, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.4) inset,
    0 1px 0 rgba(255, 255, 255, 0.35) inset;
  backdrop-filter: blur(10px);
  color: #0c4a6e;
  font-size: 13px;
  line-height: 1.45;
  user-select: none;
}

.head-title--dragging {
  cursor: grabbing;
  box-shadow:
    0 16px 48px rgba(2, 132, 199, 0.35),
    0 0 20px rgba(56, 189, 248, 0.4);
}

.head-title__drag-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: grab;
  background: linear-gradient(
    90deg,
    rgba(186, 230, 253, 0.5) 0%,
    rgba(125, 211, 252, 0.5) 50%,
    rgba(56, 189, 248, 0.5) 100%
  );
  border-bottom: 1px solid rgba(2, 132, 199, 0.5);
}

.head-title--dragging .head-title__drag-bar {
  cursor: grabbing;
}

.head-title__eco-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #e0f2fe, #38bdf8 55%, #0284c7);
  box-shadow: 0 0 12px rgba(14, 165, 233, 0.5);
}

.head-title__badge {
  flex: 1;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-size: 12px;
  text-transform: uppercase;
  color: #075985;
}

.head-title__hint {
  font-size: 11px;
  color: rgba(7, 89, 133, 0.7);
}

.head-title__body {
  padding: 12px 14px 14px;
  user-select: text;
}

.head-title__body p {
  margin: 6px 0;
  padding-bottom: 6px;
  border-bottom: 1px dashed rgba(2, 132, 199, 0.35);
  color: #0c4a6e;
}

.head-title__body p:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>
