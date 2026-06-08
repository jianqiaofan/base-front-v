<template>
  <div class="resultforseller-container scrollable-div">
    <div class="head-title" :class="{
      'head-title--dragging': headTitleDrag.active,
      'head-title--minimized': headTitleMinimized
    }" :style="headTitlePanelStyle">
      <div class="head-title__drag-bar" :title="tr('拖动移动面板', 'Drag to move')" @mousedown.stop.prevent="onHeadTitleDragStart">
        <span class="head-title__eco-icon" aria-hidden="true" />
        <span v-if="headTitleMinimized" class="head-title__summary" :title="headTitleSummaryText">{{
          headTitleSummaryText }}</span>
        <template v-else>
          <span class="head-title__badge">Plan</span>
          <span class="head-title__hint">Drag</span>
        </template>
        <el-button
          class="head-title__lang-btn"
          type="text"
          size="mini"
          :title="tr('切换到英文', 'Switch to Chinese')"
          @mousedown.stop
          @click.stop="toggleLanguage"
        >{{ lgc ? 'EN' : '中文' }}</el-button>
        <button
          type="button"
          class="head-title__toggle-btn"
          :title="headTitleMinimized ? tr('恢复', 'Restore') : tr('最小化', 'Minimize')"
          @mousedown.stop
          @click.stop="toggleHeadTitleMinimize">
          <i :class="headTitleMinimized ? 'el-icon-full-screen' : 'el-icon-minus'"></i>
        </button>
      </div>
      <div v-show="!headTitleMinimized" class="head-title__body">
        <p>{{ tr('当前用户', 'User') }}：{{ name }}</p>
        <p>{{ tr('项目编号', 'Project Code') }}：{{ theProjectAndPlanObj.project_code }}</p>
        <p>{{ tr('项目名称', 'Project Name') }}：{{ theProjectAndPlanObj.project_name }}</p>
        <p>{{ tr('方案名称', 'Plan Name') }}：{{ theProjectAndPlanObj.plan_description }}</p>
        <p>{{ tr('销售经理', 'Sales Manager') }}：{{ theProjectAndPlanObj.seller }}</p>
        <p>{{ tr('设计师', 'Designer') }}：{{ theProjectAndPlanObj.designer }}</p>
      </div>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('项目成本价', 'Project Cost Price') }}</span>
          </div>
        </template>
        <div class="summary-plan-table" style="margin-left: 20px">
          <!--    {{planResult}}-->
          <el-table :data="planResult.summaryData || []" border stripe class="summary-plan-table__grid"
            style="width: 1800px" :row-class-name="summaryPlanRowClassName" :cell-class-name="summaryPlanCellClassName">
            <el-table-column type="index" :label="tr('序号', 'No.')" width="50" align="center" header-align="center"
              :index="summaryPlanIndexMethod"></el-table-column>
            <el-table-column prop="trackBrifeName" :label="tr('型号', 'Model')" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="trackerNum" :label="tr('数量(套)', 'Qty (sets)')" width="80" align="center"
              header-align="center"></el-table-column>
            <el-table-column prop="trackerNumRatio" :label="tr('占比%', 'Share %')" width="70" align="right" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="pvCapacity" :label="tr('组件容量(W)', 'Module Power (W)')" width="120" align="center" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="solarList" :label="tr('组件排布', 'Module Layout')" width="120" align="center" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="trackerWeightSpare" :label="tr('单套重量(kg)', 'Weight / set (kg)')" width="120" align="right" header-align="center"
              :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerCapacity" :label="tr('容量(kW)', 'Capacity (kW)')" width="80" align="right" header-align="center"
              :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerTotalWeightSpare" :label="tr('总重量(kg)', 'Total Weight (kg)')" width="120" align="right"
              header-align="center" :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerTotalWeightOnlyStructureSpare" width="120" align="right" header-align="center"
              :formatter="formatNumber3">
              <template #header>
                <div class="summary-plan-table__header-multiline">
                  <div>{{ tr('总重量', 'Total Weight') }}</div>
                  <div class="summary-plan-table__header-sub">{{ tr('(不含机械电气)', '(excl. M&E)') }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="trackerTotalCapacity" :label="tr('总容量(kW)', 'Total Capacity (kW)')" width="120" align="right" header-align="center"
              :formatter="formatNumber3"></el-table-column>
            <el-table-column prop="trackerPriceSpare" :label="tr('单套价格', 'Price / set')" width="120" align="right" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="trackerTotalPriceSpare" :label="tr('总价格', 'Total Price')" width="150" align="right" header-align="center"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="pricePerWattSpare" :label="tr('瓦单价', 'Price / W')" width="110" align="right" header-align="center"
              :formatter="formatNumber6"></el-table-column>
          </el-table>
          <p style="color: red">{{ tr('* 单套重量、总重量、单套价格、总价格、瓦单价均是含有备品备件的数据', '* Weight/price metrics include spare parts') }}</p>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('桩信息统计', 'Pile information statistics') }}</span>
          </div>
        </template>
        <div class="summary-plan-table pile-info-table-wrap" style="margin-left: 20px">
          <el-table
            ref="pileInfoTable"
            :data="pileInfoStatisticsDisplay"
            border
            stripe
            class="summary-plan-table__grid"
            style="width: 1800px"
            :row-class-name="pileInfoRowClassName"
            :cell-class-name="summaryPlanCellClassName"
            @cell-mouse-enter="onPileInfoCellEnter"
            @cell-mouse-leave="onPileInfoCellLeave"
          >
            <el-table-column type="index" :label="tr('序号', 'No.')" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="trackBrifeName" :label="tr('支架型号', 'Tracker type')" width="180px"></el-table-column>
            <el-table-column prop="trackerNum" :label="tr('支架数量', 'Tracker quantity')" width="80px"></el-table-column>
            <el-table-column prop="trackerPileType" :label="tr('桩类型', 'Pile type')" width="120px"></el-table-column>
            <el-table-column prop="trackerPileNum" :label="tr('桩数量', 'Pile quantity')" width="80px"></el-table-column>
            <el-table-column prop="trackerPileTotalNum" :label="tr('桩总数', 'Total pile number')" width="100px"></el-table-column>
            <el-table-column
              prop="trackerPileAverageDepth"
              :label="tr('平均深度', 'Average depth')"
              width="80px"
              class-name="pile-info-col-plain"
              label-class-name="pile-info-col-plain"
              :formatter="formatInteger"
            ></el-table-column>
            <el-table-column
              prop="trackerPileAveragePricePer10cm"
              :label="tr('10厘米价格', 'Avg price / 10cm')"
              width="120"
              align="right"
              header-align="center"
              :formatter="formatFixed4"
            ></el-table-column>
            <el-table-column
              column-key="pileDetail"
              :label="tr('明细', 'Detail')"
              width="80"
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  v-if="!row.isPileInfoTotal && row.trackBrifeName !== '合计'"
                  class="pile-detail-trigger"
                >{{ tr('查看', 'View') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <transition name="el-fade-in">
            <div
              v-show="pileDetailTip.visible"
              class="pile-detail-tip"
              :style="pileDetailTipStyle"
              @mouseenter="cancelPileDetailTipHide"
              @mouseleave="onPileDetailTipMouseLeave"
            >
              <div class="pile-detail-tip__title">
                {{ pileDetailTip.row && pileDetailTip.row.trackBrifeName }}
                — {{ tr('桩明细', 'Pile details') }}
              </div>
              <el-table
                :data="pileDetailTip.list"
                border
                size="mini"
                max-height="360"
                class="pile-detail-tip__table"
                empty-text="-"
              >
                <el-table-column prop="pile_type" :label="tr('桩类型', 'Pile type')" min-width="88" show-overflow-tooltip></el-table-column>
                <el-table-column prop="category" :label="tr('类别', 'Category')" width="72" show-overflow-tooltip></el-table-column>
                <el-table-column prop="position" :label="tr('位置', 'Position')" width="72" show-overflow-tooltip></el-table-column>
                <el-table-column prop="section" :label="tr('截面', 'Section')" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="material" :label="tr('材质', 'Material')" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="depth" :label="tr('深度', 'Depth')" width="72" align="right" :formatter="formatNumber2"></el-table-column>
                <el-table-column prop="num" :label="tr('数量', 'Qty')" width="56" align="center"></el-table-column>
                <el-table-column
                  prop="pile_meter_price"
                  :label="tr('米价', 'Price/m')"
                  width="88"
                  align="right"
                  :formatter="formatFixed4"
                ></el-table-column>
              </el-table>
            </div>
          </transition>
          <p style="color: red">{{ tr('* 10厘米桩平均瓦单价', '* Avg pile price per W (10cm)') }}：{{ pileAveragePricePerWatt.toFixed(10) }}{{ tr('元(人民币)', ' RMB (CNY)') }}</p>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('支架防腐信息', 'Tracker corrosion information') }}</span>
          </div>
        </template>
        <div class="summary-plan-table tracker-corrosion-info-table-wrap" style="margin-left: 20px">
          <el-table :data="trackerCorrosionInfoDisplay" border stripe class="summary-plan-table__grid"
            style="width: 1800px">
            <el-table-column type="index" :label="tr('序号', 'No.')" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="trackBrifeName" :label="tr('支架型号', 'Tracker type')" width="180px"></el-table-column>
            <el-table-column prop="corrosionProofingGrade" :label="tr('防腐等级', 'Corrosion proofing grade')" width="100px"></el-table-column>
            <el-table-column prop="beamBrand" :label="tr('主梁品牌', 'Beam brand')" width="100px"></el-table-column>
            <el-table-column prop="purlinBrand" :label="tr('檩条品牌', 'Purlin brand')" width="100px" ></el-table-column>
            <el-table-column prop="postGalvanizinThickness" :label="tr('立柱防腐厚度', 'Post galvanizin thickness')" width="120px"></el-table-column>
            <el-table-column prop="beamGalvanizinThickness" :label="tr('主梁防腐厚度', 'Beam galvanizin thickness')" width="120px"></el-table-column>
            <el-table-column  prop="purlinGalvanizinThickness" :label="tr('檩条防腐厚度', 'Purlin galvanizin thickness')" width="120px" ></el-table-column>
            <el-table-column prop="boltSurfaceTreatment" :label="tr('螺栓防腐处理', 'Bolt surface treatment')" width="160px" ></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('支架几何信息', 'Tracker geometry information') }}</span>
          </div>
        </template>
        <div class="summary-plan-table tracker-geometry-info-table-wrap" style="margin-left: 20px">
          <el-table :data="trackerGeometryInfoDisplay" border stripe class="summary-plan-table__grid" style="width: 1800px">
            <el-table-column type="index" :label="tr('序号', 'No.')" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="trackBrifeName" :label="tr('支架型号', 'Tracker type')" width="180px"></el-table-column>
            <el-table-column prop="trackerNum" :label="tr('支架数量', 'Tracker quantity')" width="80px"></el-table-column>
            <el-table-column prop="panelLength" :label="tr('板长', 'Panel length')" width="120px"></el-table-column>
            <el-table-column prop="panelWidth" :label="tr('板宽', 'Panel width')" width="120px"></el-table-column>
            <el-table-column prop="panelThickness" :label="tr('板厚', 'Panel thickness')" width="120px"></el-table-column>
            <el-table-column prop="panelWeight" :label="tr('板重', 'Panel weight')" width="120px"></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('材料费', 'Material Cost') }}</span>
          </div>
        </template>
        <div>
          <el-table :data="materialFee" border style="width: 1200px">
            <el-table-column type="index" :label="tr('序号', 'No.')" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="name" :label="tr('材料名称', 'Material')" width="150"></el-table-column>
            <el-table-column prop="totalPrice" :label="tr('总价(RMB 元)', 'Total (RMB)')" width="200"
              :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="pricePerWatt" :label="tr('瓦单价', 'Price / W')" width="200" :formatter="formatNumber6"></el-table-column>
            <el-table-column prop="totalWeight" :label="tr('总重(kg)', 'Total Weight (kg)')" width="200" :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="tonPerMw" :label="tr('兆瓦吨重', 't/MW')" width="200" :formatter="formatNumber6"></el-table-column>
            <el-table-column prop="processingSite" :label="tr('生产地', 'Origin')" width="160"></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="6">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('非材料费(运费、服务费等)', 'Non-material costs (freight, services, etc.)') }}</span>
          </div>
        </template>
        <h3>{{ tr('汇率换算', 'FX conversion') }}</h3>
        <div class="fee-div">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label="tr('美元汇率$', 'USD rate $')">
              <el-input v-model="form.exchange_rate_usd" :placeholder="tr('美元汇率', 'USD rate')" style="width:72px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="tr('欧元汇率€', 'EUR rate €')" style="margin-left: 10px">
              <el-input v-model="form.exchange_rate_eur" :placeholder="tr('欧元汇率', 'EUR rate')" style="width:72px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="tr('兑换手续费', 'FX handling fee')" style="margin-left: 10px">
              <el-input v-model="form.exchange_rate_handling_fee" :placeholder="tr('兑换手续费', 'Handling fee')" style="width:60px;"
                size="mini"></el-input>
            </el-form-item>
            <el-form-item label="%"></el-form-item>
            <el-form-item>
              <span class="summary-exchange-btns">
                <el-button type="success" size="mini" @click="getExchangeRate"
                  :loading="exchangeRateLoading">{{ tr('刷新汇率', 'Refresh') }}</el-button>
                <el-button type="primary" size="mini" @click="openBocExchangePage">{{ tr('外汇牌价', 'BOC FX rates') }}</el-button>
              </span>
            </el-form-item>
          </el-form>
          <p class="exchange-note">{{ tr('* 输入币种说明：¥-人民币,$-美元,€-欧元', '* Currency: ¥=RMB, $=USD, €=EUR') }}</p>
        </div>

        <h3>{{ tr('运费、税费等与生产地有关的费用', 'Freight / tax by origin') }}</h3>
        <div class="fee-div" v-for="psd in (form.process_site || [])" :key="psd.location || psd.id">
          <el-form :inline="true" class="demo-form-inline">
            <p class="prosite">
              <span>
                <i class="el-icon-location-outline"></i> {{ tr('生产地', 'Origin') }}：
                <span class="location-tag">{{ psd.location }}</span>
              </span>
              <span>
                <i class="el-icon-money"></i> {{ tr('总货值', 'Goods value') }}：
                <span class="value">{{ psd.goodTotalPrice }}</span> {{ tr('元(¥)', 'RMB (¥)') }}
              </span>
              <span>
                <i class="el-icon-ship"></i> {{ tr('总货重', 'Total weight') }}：
                <span class="value">{{ psd.goodTotalWeight / 1000 }}</span> {{ tr('吨', 'ton') }}
              </span>
            </p>
          </el-form>

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label="tr('生产工厂到港口运费单价', 'Factory → port freight unit price')">
              <el-select v-model="psd.method" :placeholder="tr('请选择', 'Select')" style="width:100px;" size="mini">
                <el-option :label="tr('散装', 'Bulk')" value="bulk"></el-option>
                <el-option :label="tr('整运', 'Container')" value="container"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="margin-left: 0px">
              <el-input v-show="psd.method === 'bulk'" v-model="psd.bulk_unit_price" :placeholder="tr('每吨运费单价', 'Unit price per ton')"
                style="width:80px;" size="mini"></el-input>
              <el-input v-show="psd.method === 'container'" v-model="psd.container_unit_price"
                :placeholder="tr('每集装箱运费单价', 'Unit price per container')"
                style="width:80px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item
              v-show="psd.method === 'container'"
              :label="tr('(¥/集装箱)', '(¥/Container)')"
            ></el-form-item>
            <el-form-item
              v-show="psd.method === 'bulk'"
              :label="tr('(¥/吨)', '(¥/Ton)')"
            ></el-form-item>
            <el-form-item :label="tr('集装箱限重', 'Container max weight')">
              <el-input v-model="psd.container_limit_weight" placeholder="" style="width:60px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="tr('吨', 'Ton')"></el-form-item>
          </el-form>

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label="tr('生产国出口海运费', 'Ocean freight (export)')">
              <el-input v-model="psd.unit_ocean_freight" :placeholder="tr('每箱运费(按美元计价)', 'Per container (USD)')" style="width:100px"
                size="mini"></el-input>
              <el-form-item :label="tr('($/箱)', '($/Container)')" style="margin-left: 6px"></el-form-item>
            </el-form-item>
            <el-form-item :label="tr('目地国港杂+派送费单价', 'Port fees + delivery (import)')">
              <el-input v-model="psd.import_port_fees" :placeholder="tr('目地国港杂+派送费', 'Port fees + delivery')" style="width:100px"
                size="mini"></el-input>
              <el-form-item :label="tr('($/吨)', '($/Ton)')" style="margin-left: 6px"></el-form-item>
            </el-form-item>
          </el-form>

          <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label="tr('项目所在国关税', 'Import tariff')">
              <el-switch v-model="psd.switch_tariff" :active-text="tr('有关税', 'Enabled')" :inactive-text="tr('无关税', 'Disabled')">
              </el-switch>
              <el-form-item v-show="psd.switch_tariff" :label="tr('关税税率', 'Tariff rate')" style="margin-left: 18px"></el-form-item>
              <el-input v-show="psd.switch_tariff" v-model="psd.tariff_rate" :placeholder="tr('关税税率', 'Tariff rate')" style="width:100px"
                size="mini"></el-input>
              <el-form-item v-show="psd.switch_tariff" label="(%)" style="margin-left: 6px"></el-form-item>
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label="tr('生产国出口退税', 'Export tax refund')">
              <el-switch v-model="psd.switch_tax_refund" :active-text="tr('有退税', 'Enabled')" :inactive-text="tr('无退税', 'Disabled')">
              </el-switch>
              <el-form-item v-show="psd.switch_tax_refund" :label="tr('退税税率', 'Refund rate')" style="margin-left: 18px"></el-form-item>
              <el-input v-show="psd.switch_tax_refund" v-model="psd.tax_refund_rate" :placeholder="tr('退税税率', 'Refund rate')"
                style="width:100px" size="mini"></el-input>
              <el-form-item v-show="psd.switch_tax_refund" label="(%)" style="margin-left: 6px"></el-form-item>
            </el-form-item>
          </el-form>

        </div>
        <h3>{{ tr('其它费用', 'Other costs') }}</h3>
        <div class="fee-div fee-div--has-save-btn">
          <el-form class="other-fee-form" label-width="120px">
            <el-form-item :label="tr('安装指导费', 'Installation guidance')">
              <el-switch v-model="form.guide_fee_switch" :active-text="tr('有', 'Yes')" :inactive-text="tr('无', 'No')">
              </el-switch>
              <el-input v-show="form.guide_fee_switch" v-model="form.guide_fee" :placeholder="tr('安装指导费', 'Daily fee')"
                style="width:80px; margin-left: 10px" size="mini"></el-input>
              <span v-show="form.guide_fee_switch" class="other-fee-form__unit">($/day)</span>
              <el-input v-show="form.guide_fee_switch" v-model="form.guide_days" :placeholder="tr('服务天数', 'Days')"
                style="width:80px; margin-left: 10px" size="mini"></el-input>
              <span v-show="form.guide_fee_switch" class="other-fee-form__hint">{{ tr('天', 'days') }}</span>
              <span v-show="form.guide_fee_switch" class="other-fee-form__hint">{{ tr('建议服务天数:', 'Suggested days:') }}{{
                getDayOfService(planResult.planCapacity) }} </span>
            </el-form-item>
            <el-form-item :label="tr('保函和财务费', 'Guarantee & finance fees')">
              <el-switch v-model="form.guarantee_and_financial_fees_switch" :active-text="tr('有', 'Yes')" :inactive-text="tr('无', 'No')">
              </el-switch>
              <el-input v-show="form.guarantee_and_financial_fees_switch" v-model="form.guarantee_and_financial_fees"
                :placeholder="tr('财务费等', 'Amount')" style="width:130px; margin-left: 10px" size="mini"></el-input>
              <span v-show="form.guarantee_and_financial_fees_switch" class="other-fee-form__unit">(¥)</span>
            </el-form-item>
            <el-form-item :label="tr('其它附加费用', 'Additional fees')">
              <el-switch v-model="form.other_additional_fees_switch" :active-text="tr('有', 'Yes')" :inactive-text="tr('无', 'No')">
              </el-switch>
              <el-input v-show="form.other_additional_fees_switch" v-model="form.other_additional_fees"
                :placeholder="tr('其它附加费用', 'Amount')" style="width:130px; margin-left: 10px" size="mini"></el-input>
              <span v-show="form.other_additional_fees_switch" class="other-fee-form__unit">(¥)</span>
            </el-form-item>
          </el-form>
          <el-button class="fee-div__save-btn" type="primary" size="mini" @click="saveFormInfo">{{ tr('保存输入信息', 'Save') }}</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item name="7">
        <template #title>
          <div style="color: red; display: flex; align-items: center; font-size: 18px">
            <i class="el-icon-info"></i> <!-- 图标 -->
            <span style="margin-left: 8px; font-weight: bold;">{{ tr('报价价格(按瓦单价)', 'Quotation price (per watt)') }}</span>
          </div>
        </template>
        <h3>{{ tr('毛利率与运输条款', 'Margin & trade terms') }}</h3>
        <div class="basic-price-table-wrap" style="width: 1600px">
          <div class="basic-price-filters">
            <span class="basic-price-filters__label">{{ tr('货币', 'Currency') }}</span>
            <el-select
              v-model="basicPriceCurrencyFilter"
              multiple
              :placeholder="tr('请选择货币', 'Select currency')"
              size="small"
              class="basic-price-filters__select"
              @change="onBasicPriceCurrencyFilterChange"
            >
              <el-option
                v-for="item in basicPriceCurrencyOptions"
                :key="item"
                :label="currencyOptionLabel(item)"
                :value="item"
              />
            </el-select>
            <span class="basic-price-filters__label">{{ tr('贸易术语', 'Incoterm') }}</span>
            <el-select
              v-model="basicPriceTermFilter"
              multiple
              :placeholder="tr('请选择贸易术语', 'Select term')"
              size="small"
              class="basic-price-filters__select"
              @change="onBasicPriceTermFilterChange"
            >
              <el-option
                v-for="item in basicPriceTermOptions"
                :key="item"
                :label="termOptionLabel(item)"
                :value="item"
              />
            </el-select>
          </div>
          <el-table ref="basicPriceTable" height="600px" :data="basicPrice" border stripe size="small"
            :style="{ width: basicPriceTableWidth + 'px' }" :row-class-name="basicPriceRowClassName"
            @cell-mouse-enter="onBasicPriceRowEnter" @cell-mouse-leave="onBasicPriceRowLeave">
            <el-table-column prop="margin" label="Margin" width="80px" fixed="left"></el-table-column>
            <el-table-column
              v-for="col in basicPriceVisibleColumns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              width="90px"
              :formatter="formatNumber4"
            ></el-table-column>
          </el-table>
          <transition name="el-fade-in-linear">
            <div v-show="basicPriceRowTip.visible" class="basic-price-row-tip" :class="{
              'basic-price-row-tip--pinned': basicPriceRowTip.pinned,
              'basic-price-row-tip--dragging': basicPriceRowTipDrag.active
            }" :style="basicPriceRowTipStyle" @mouseenter="cancelBasicPriceRowTipHide"
              @mouseleave="onBasicPriceRowTipMouseLeave">
              <div class="basic-price-row-tip__header" :title="tr('拖拽移动', 'Drag to move')"
                @mousedown.stop.prevent="onBasicPriceRowTipDragStart">
                <div class="basic-price-row-tip__title">
                  Margin {{ basicPriceRowTip.row && basicPriceRowTip.row.margin }}%
                </div>
                <div class="basic-price-row-tip__actions">
                  <el-button type="text" size="mini" class="basic-price-row-tip__action-btn"
                    :class="{ 'basic-price-row-tip__action-btn--active': basicPriceRowTip.pinned }"
                    :title="basicPriceRowTip.pinned ? tr('取消固定', 'Unpin') : tr('固定（失焦不关闭，Margin 不变）', 'Pin (keep open)')"
                    @click.stop="toggleBasicPriceRowTipPin">
                    <i :class="basicPriceRowTip.pinned ? 'el-icon-unlock' : 'el-icon-lock'"></i>
                  </el-button>
                  <el-button type="text" size="mini"
                    class="basic-price-row-tip__action-btn basic-price-row-tip__action-btn--close" :title="tr('关闭', 'Close')"
                    @click.stop="closeBasicPriceRowTip">
                    <i class="el-icon-close"></i>
                  </el-button>
                </div>
              </div>
              <table class="basic-price-row-tip__table">
                <thead>
                  <tr>
                    <th class="basic-price-row-tip__table-corner"></th>
                    <th v-for="cur in basicPriceTipCurrenciesDisplay" :key="cur.key" class="basic-price-row-tip__table-head">{{
                      cur.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="term in basicPriceTipTerms" :key="term">
                    <th class="basic-price-row-tip__table-term">{{ term }}</th>
                    <td v-for="cur in basicPriceTipCurrenciesDisplay" :key="cur.key + term"
                      class="basic-price-row-tip__table-cell">{{ formatBasicPriceTipValue(basicPriceRowTip.row, cur.key,
                        term) }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="basic-price-row-tip__margin" @mousedown.stop @click.stop>
                <span class="basic-price-row-tip__margin-label">{{ tr('利润率', 'Margin') }}</span>
                <el-input-number v-model="basicPriceRowTipMarginInput" size="mini" :step="0.01" :precision="2" :min="0"
                  :max="99.99" controls-position="right" class="basic-price-row-tip__margin-input"
                  @change="onBasicPriceRowTipMarginChange" />
                <span class="basic-price-row-tip__margin-unit">%</span>
                <el-button type="primary" size="mini" icon="el-icon-refresh" class="basic-price-row-tip__refresh-btn"
                  :title="tr('刷新计算', 'Recalculate')" @click.stop="refreshBasicPriceRowTip">{{ tr('刷新', 'Refresh') }}</el-button>
                <el-button type="success" size="mini" icon="el-icon-document" class="basic-price-row-tip__quotation-btn"
                  :title="tr('生成报价单', 'Generate quotation')" @click.stop="openQuotationReportDrawer">{{ tr('生成报价单', 'Quotation') }}</el-button>
              </div>
            </div>
          </transition>
        </div>
        <div>
          <p>{{ tr('贸易术语名称解释：', 'Incoterms explained:') }}</p>
          <p>{{ tr('EXW：(Ex Works),代表“离厂价”或“工厂交货”。卖方只需在工厂（或其他指定地点）准备好货物，并提供必要的出口文件，如商业发票、装箱单等。而买方则需负责从卖方指定的地点自行提货，并承担此后的所有运输、清关、税费和保险等费用。', 'EXW (Ex Works): The seller makes the goods available at its premises (or another named place). The buyer bears all costs and risks involved in taking the goods from there, including transport, customs, taxes, and insurance.') }}</p>
          <p>{{ tr('FOB：(Free On Board),“离岸价”或“船上交货价”，指卖方在约定装运港将货物装上买方指定船只并完成出口手续，买方负责租船订舱及货物装船后的运输与保险。', 'FOB (Free On Board): The seller delivers the goods on board the vessel nominated by the buyer at the named port of shipment and clears the goods for export. The buyer arranges main carriage and insurance after loading.') }}</p>
          <p>{{ tr('CIF：(Cost, Insurance and Freight),成本加保险费加运费。', 'CIF (Cost, Insurance and Freight): The seller pays costs, insurance, and freight to bring the goods to the named port of destination.') }}</p>
          <p>{{ tr('DAP：(Delivered At Place),目的地交货，是指卖方已经用运输工具把货物运送到达买方指定的目的地后，将装在运输工具上的货物（不用卸载）交由买方处置。', 'DAP (Delivered At Place): The seller delivers when the goods are placed at the disposal of the buyer on the arriving means of transport, ready for unloading at the named place of destination.') }}</p>
          <p>{{ tr('DDP：(Delivered Duty Paid),需要由卖方办理进口清关手续的术语，卖方需承担将货物运至指定目的地的一切风险和费用，包括在目的地应交纳的关税、税款及其他费用。', 'DDP (Delivered Duty Paid): The seller bears all costs and risks to deliver the goods to the named place in the country of import, including import clearance and payment of duties and taxes.') }}</p>
        </div>
      </el-collapse-item>

    </el-collapse>

    <el-drawer :title="tr('报价单', 'Quotation')" :visible.sync="quotationReportDrawerVisible" direction="btt" size="90%" append-to-body
      :destroy-on-close="false" custom-class="result-for-seller__quotation-drawer">
      <div class="result-for-seller__quotation-scroll">
        <seller-tool-quotation :quotation-parent="quotation" />
      </div>
    </el-drawer>
  </div>

</template>

<script>
import { getToken } from '@/utils/auth'
import { getInfo } from '@/api/user'
import { mapGetters } from 'vuex'
import { Quotation } from '@/views/pages/eset/trackers2/utils/classQuotation'
import SellerToolQuotation from '@/views/pages/eset/components/SellerTool/SellerToolQuotation.vue'

export default {
  name: 'ResultForSeller',
  components: {
    SellerToolQuotation,
  },
  data() {
    return {
      lgc: false, // true=中文, false=English
      activeNames: ['6', '7'],
      form: {},
      exchangeRateLoading: false,
      headTitlePos: { left: 0, top: 60 },
      headTitleDrag: {
        active: false,
        startX: 0,
        startY: 0,
        originLeft: 0,
        originTop: 0
      },
      headTitleMinimized: false,
      basicPriceCurrencyOptions: ['全部', '美元', '欧元'],
      basicPriceTermOptions: ['全部', 'EXW', 'FOB', 'CIF', 'DAP', 'DDP'],
      basicPriceCurrencyFilter: ['全部'],
      basicPriceTermFilter: ['全部'],
      _basicPriceCurrencyFilterPrev: ['全部'],
      _basicPriceTermFilterPrev: ['全部'],
      basicPriceTipTerms: ['exw', 'fob', 'cif', 'dap', 'ddp'],
      basicPriceTipCurrencies: [
        // { key: 'rmb', label: 'RMB(人民币)' },
        { key: 'usd', label: 'USD(美元)' },
        { key: 'eur', label: 'EUR(欧元)' }
      ],
      basicPriceRowTip: {
        visible: false,
        top: 0,
        left: 0,
        row: null,
        pinned: false
      },
      basicPriceRowTipDrag: {
        active: false,
        startX: 0,
        startY: 0,
        originLeft: 0,
        originTop: 0
      },
      basicPriceRowTipHideTimer: null,
      basicPriceActiveRowKey: null,
      basicPriceRowTipMarginInput: 0,
      pileDetailTip: {
        visible: false,
        top: 0,
        left: 0,
        row: null,
        list: []
      },
      pileDetailTipHideTimer: null,
      pileDetailActiveRowId: null,
      quotationReportDrawerVisible: false,
      quotation: new Quotation(),
    }
  },
  computed: {
    ...mapGetters(['name']),
    basicPriceTipCurrenciesDisplay() {
      return [
        // { key: 'rmb', label: this.tr('RMB(人民币)', 'RMB') },
        { key: 'usd', label: this.tr('USD(美元)', 'USD') },
        { key: 'eur', label: this.tr('EUR(欧元)', 'EUR') }
      ]
    },
    basicPriceRowTipStyle() {
      return {
        top: `${this.basicPriceRowTip.top}px`,
        left: `${this.basicPriceRowTip.left}px`
      }
    },
    pileDetailTipStyle() {
      return {
        top: `${this.pileDetailTip.top}px`,
        left: `${this.pileDetailTip.left}px`
      }
    },
    /** 桩信息统计表 + 合计行（深度、10厘米价格为按桩总数加权平均） */
    pileInfoStatisticsDisplay() {
      const rows = (this.planResult && this.planResult.pileInfoStatistics) || []
      if (rows.length === 0) return []

      let totalTrackerNum = 0
      let totalPileNum = 0
      let weightedDepth = 0
      let weightedPrice10cm = 0

      rows.forEach(row => {
        if (row && row.trackBrifeName === '合计') return
        const trackerNum = Number(row.trackerNum) || 0
        const pileTotal = Number(row.trackerPileTotalNum) || 0
        const avgDepth = Number(row.trackerPileAverageDepth) || 0
        const avgPrice10 = Number(row.trackerPileAveragePricePer10cm) || 0

        totalTrackerNum += trackerNum
        totalPileNum += pileTotal
        weightedDepth += avgDepth * pileTotal
        weightedPrice10cm += avgPrice10 * pileTotal
      })

      return [
        ...rows.filter(row => row && row.trackBrifeName !== '合计'),
        {
          trackBrifeName: '合计',
          trackerNum: totalTrackerNum,
          trackerPileType: '',
          trackerPileNum: '',
          trackerPileTotalNum: totalPileNum,
          trackerPileAverageDepth: totalPileNum ? weightedDepth / totalPileNum : 0,
          trackerPileAveragePricePer10cm: totalPileNum ? weightedPrice10cm / totalPileNum : 0,
          isPileInfoTotal: true
        }
      ]
    },
    trackerCorrosionInfoDisplay() {
      return this.planResult.trackerCorrosionInfo || []
    },
    trackerGeometryInfoDisplay() {
      return this.planResult.trackerGeometryInfo || []
    },
    //10厘米桩平均瓦单价计算
    pileAveragePricePerWatt() {
      return this.pileInfoStatisticsDisplay.reduce((a, b) => a + b.trackerPileAveragePricePer10cm*b.trackerPileNum*b.trackerNum, 0) / this.planTotalCapacity
    },
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
    headTitleSummaryText() {
      const code = this.theProjectAndPlanObj.project_code
      const name = this.theProjectAndPlanObj.project_name
      if (code && name) return `${code}|${name}`
      return code || name || 'Plan'
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
      const marginTable = []
      for (let margin = 0; margin < 31; margin++) {
        marginTable.push(this.getBasicPriceByMargin(margin))
      }
      return marginTable
    },
    basicPriceAllColumns() {
      const currencies = ['rmb', 'usd', 'eur']
      const terms = ['exw', 'fob', 'cif', 'dap', 'ddp']
      return currencies.flatMap(cur =>
        terms.map(term => ({
          prop: `${cur}_${term}`,
          label: `${cur}_${term}`
        }))
      )
    },
    basicPriceVisibleColumns() {
      return this.basicPriceAllColumns.filter(col => {
        const [cur, term] = col.prop.split('_')
        let r = this.isBasicPriceCurrencyVisible(cur) && this.isBasicPriceTermVisible(term)
        //将人民币过滤不要
        r = r && cur !== 'rmb'
        return r
      })
    },
    basicPriceTableWidth() {
      return 80 + this.basicPriceVisibleColumns.length * 90
    }
  },
  methods: {
    tr(cn, en) {
      return this.lgc ? cn : en
    },
    toggleLanguage() {
      this.lgc = !this.lgc
    },
    currencyOptionLabel(val) {
      const map = { 全部: 'All', 美元: 'USD', 欧元: 'EUR'}
      return this.lgc ? val : (map[val] || val)
    },
    termOptionLabel(val) {
      if (this.lgc) return val
      return val === '全部' ? 'All' : val
    },
    /**
     * 「全部」与其它项互斥：仅「全部」= 不过滤；选其它项则去掉「全部」；空选则回到「全部」
     */
    normalizeExclusiveAllFilter(val, prev) {
      const ALL = '全部'
      if (!val || val.length === 0) return [ALL]

      const hasAll = val.includes(ALL)
      const specifics = val.filter(item => item !== ALL)

      if (!hasAll) return specifics.length ? specifics : [ALL]
      if (specifics.length === 0) return [ALL]

      const prevWasOnlyAll = prev && prev.length === 1 && prev[0] === ALL
      return prevWasOnlyAll ? specifics : [ALL]
    },
    onBasicPriceCurrencyFilterChange(val) {
      const normalized = this.normalizeExclusiveAllFilter(val, this._basicPriceCurrencyFilterPrev)
      this.basicPriceCurrencyFilter = normalized
      this._basicPriceCurrencyFilterPrev = [...normalized]
    },
    onBasicPriceTermFilterChange(val) {
      const normalized = this.normalizeExclusiveAllFilter(val, this._basicPriceTermFilterPrev)
      this.basicPriceTermFilter = normalized
      this._basicPriceTermFilterPrev = [...normalized]
    },
    isBasicPriceCurrencyVisible(curKey) {
      const labelMap = { rmb: '人民币', usd: '美元', eur: '欧元' }
      const selected = this.basicPriceCurrencyFilter
      if (!selected.length || selected.includes('全部')) return true
      return selected.includes(labelMap[curKey])
    },
    isBasicPriceTermVisible(termKey) {
      const labelMap = { exw: 'EXW', fob: 'FOB', cif: 'CIF', dap: 'DAP', ddp: 'DDP' }
      const selected = this.basicPriceTermFilter
      if (!selected.length || selected.includes('全部')) return true
      return selected.includes(labelMap[termKey])
    },
    //保存报价信息
    saveFormInfo() {
      fetch(process.env.VUE_APP_BASE_API + '/api/saveShippingInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        }, 
        body: JSON.stringify({
          username: this.name,
          project_code: this.projectAndPlan.project_code,
          project_name: this.projectAndPlan.project_name,
          plan_code: this.projectAndPlan.plan_code,
          plan_description: this.projectAndPlan.plan_description,
          info: JSON.stringify(this.form),
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error(this.tr('服务器响应异常', 'Server response error'))
        })
        .then(r => {
          if (r && r.code === 200) {
            this.$message.success(this.tr('保存成功', 'Saved'))
          } else {
            this.$message.error((r && r.message) || this.tr('保存失败', 'Save failed'))
          }
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error(error.message || this.tr('保存失败，请稍后重试', 'Save failed. Please try again later.'))
        })
    },

    //获取之前保存的报价信息
    getFormInfo() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getShippingInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        }, 
        body: JSON.stringify({
          username: this.name,
          plan_code: this.projectAndPlan.plan_code
        })
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
        }).then(r => {
          const list = r && r.data
          const success = r && r.code === 200 && Array.isArray(list) && list.length >= 1
          if (success) {
            const rawInfo = list[0].info
            if (rawInfo != null && rawInfo !== '') {
              try {
                if (typeof rawInfo === 'object') {
                  this.form = rawInfo
                  return
                }
                // 单引号 → 双引号，转为标准 JSON 再解析
                const jsonStr = String(rawInfo).trim().replace(/'/g, '"')
                const parsed = JSON.parse(jsonStr)
                if (parsed && typeof parsed === 'object') {
                  this.form = parsed
                  return
                }
              } catch (e) {
                console.error('解析 info JSON 失败:', e, rawInfo)
              }
            }
          }
          this.initForm(this.planResult)
        })
        .catch(error => {
          console.error('Error:', error)
          this.initForm(this.planResult)
        })
    },

    //通过毛利率计算各价格
    getBasicPriceByMargin(margin) {
      const processSite = this.form && this.form.process_site
      if (!Array.isArray(processSite) || processSite.length === 0) {
        return null
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
      const guide_fee = this.form.guide_fee_switch ? this.form.guide_fee * this.form.guide_days * this.form.exchange_rate_usd : 0 //安装指导
      const guarantee_and_financial_fees = this.form.guarantee_and_financial_fees_switch ? 1 * this.form.guarantee_and_financial_fees : 0  //保函等财务费用
      const other_additional_fees = this.form.other_additional_fees_switch ? 1 * this.form.other_additional_fees : 0  //第三方审核费
      const usd = this.form.exchange_rate_usd * (1 + 0.01 * this.form.exchange_rate_handling_fee)
      const eur = this.form.exchange_rate_eur * (1 + 0.01 * this.form.exchange_rate_handling_fee)
      const rmb_exw = (material_cost - tax_refund) / (1 - 0.01 * margin) + guide_fee + guarantee_and_financial_fees + other_additional_fees
      const rmb_fob = rmb_exw + delivery_process_site  //只含生产地运费
      const rmb_cif = rmb_exw + delivery_process_site + delivery_sea  //含生产地运费，海上运费
      const rmb_dap = rmb_exw + delivery_process_site + delivery_sea + delivery_project_site //含全部三段运费
      const rmb_ddp = rmb_dap + tariff  //含税
      const marginTable = {
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
      }
      // console.log('总容量', capacity)
      // console.log('材料总价', material_cost)
      // console.log('国内运费', delivery_process_site)
      // console.log('海上运费', delivery_sea)
      // console.log('国外运费', delivery_project_site)
      // console.log('关税', tariff)
      // console.log('退税', tax_refund)
      // console.log('指导费', guide_fee)
      // console.log('财务费', guarantee_and_financial_fees)
      // console.log('其它附加费用', other_additional_fees)
      // console.log(margin,marginTable)
      return marginTable
    },

    initHeadTitlePosition() {
      const panelW = 420
      const margin = 12
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
      this.headTitlePos = {
        left: Math.max(margin, vw - panelW - margin),
        top: 60
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
    toggleHeadTitleMinimize() {
      this.headTitleMinimized = !this.headTitleMinimized
    },
    /** 弹窗水平位置：表格右缘完全可见且外侧有空位时在表格右侧；否则在屏幕内靠右显示 */
    calcBasicPriceRowTipPosition(tr) {
      const tipW = 400
      const tipMaxH = 420
      const gap = 10
      const viewportMargin = 8
      const trRect = tr.getBoundingClientRect()
      const tableEl = this.$refs.basicPriceTable && this.$refs.basicPriceTable.$el
      const tableRect = tableEl ? tableEl.getBoundingClientRect() : null
      const viewportLeft = viewportMargin
      const viewportRight = window.innerWidth - viewportMargin
      let left
      const tableRightFullyVisible = tableRect && tableRect.right <= viewportRight
      const roomOutsideTable = tableRect && tableRect.right + gap + tipW <= viewportRight
      if (tableRect && tableRightFullyVisible && roomOutsideTable) {
        left = tableRect.right + gap
      } else if (tableRect && tableRightFullyVisible) {
        left = tableRect.right - gap - tipW
        left = Math.max(tableRect.left, left)
      } else {
        left = viewportRight - tipW
      }
      left = Math.max(viewportLeft, Math.min(left, viewportRight - tipW))
      let top = trRect.top
      if (top + tipMaxH > window.innerHeight - viewportMargin) {
        top = Math.max(viewportMargin, window.innerHeight - tipMaxH - viewportMargin)
      }
      return { top, left }
    },
    calcPileDetailTipPosition(tr) {
      const tipW = 720
      const tipMaxH = 400
      const gap = 10
      const viewportMargin = 8
      const trRect = tr.getBoundingClientRect()
      const tableEl = this.$refs.pileInfoTable && this.$refs.pileInfoTable.$el
      const tableRect = tableEl ? tableEl.getBoundingClientRect() : null
      const viewportLeft = viewportMargin
      const viewportRight = window.innerWidth - viewportMargin
      let left
      const tableRightFullyVisible = tableRect && tableRect.right <= viewportRight
      const roomOutsideTable = tableRect && tableRect.right + gap + tipW <= viewportRight
      if (tableRect && tableRightFullyVisible && roomOutsideTable) {
        left = tableRect.right + gap
      } else if (tableRect && tableRightFullyVisible) {
        left = tableRect.right - gap - tipW
        left = Math.max(tableRect.left, left)
      } else {
        left = viewportRight - tipW
      }
      left = Math.max(viewportLeft, Math.min(left, viewportRight - tipW))
      let top = trRect.top
      if (top + tipMaxH > window.innerHeight - viewportMargin) {
        top = Math.max(viewportMargin, window.innerHeight - tipMaxH - viewportMargin)
      }
      return { top, left }
    },
    onPileInfoCellEnter(row, column, cell, event) {
      if (!column || column.columnKey !== 'pileDetail' || !row || row.isPileInfoTotal || row.trackBrifeName === '合计') return
      this.cancelPileDetailTipHide()
      const el = (event && event.target) || cell
      const tr = el && el.closest ? el.closest('tr') : null
      if (!tr) return
      const { top, left } = this.calcPileDetailTipPosition(tr)
      this.pileDetailActiveRowId = row.id != null ? row.id : row.trackBrifeName
      this.pileDetailTip = {
        visible: true,
        top,
        left,
        row,
        list: Array.isArray(row.trackerPileInfoList) ? row.trackerPileInfoList : []
      }
    },
    onPileInfoCellLeave(row, column) {
      if (!column || column.columnKey !== 'pileDetail') return
      this.schedulePileDetailTipHide()
    },
    onPileDetailTipMouseLeave() {
      this.schedulePileDetailTipHide()
    },
    schedulePileDetailTipHide() {
      this.cancelPileDetailTipHide()
      this.pileDetailTipHideTimer = setTimeout(() => {
        this.pileDetailTip.visible = false
        this.pileDetailTip.row = null
        this.pileDetailTip.list = []
        this.pileDetailActiveRowId = null
      }, 200)
    },
    cancelPileDetailTipHide() {
      if (this.pileDetailTipHideTimer) {
        clearTimeout(this.pileDetailTipHideTimer)
        this.pileDetailTipHideTimer = null
      }
    },
    pileInfoRowClassName({ row }) {
      const base = this.summaryPlanRowClassName({ row })
      if (
        this.pileDetailActiveRowId !== null &&
        row &&
        (row.id === this.pileDetailActiveRowId || row.trackBrifeName === this.pileDetailActiveRowId)
      ) {
        return base ? `${base} pile-info-row--active` : 'pile-info-row--active'
      }
      return base
    },
    /** Element UI 2.x 使用 cell-mouse-enter，无 row-mouse-enter */
    onBasicPriceRowEnter(row, column, cell, event) {
      this.cancelBasicPriceRowTipHide()
      if (!row) return
      /* 已固定：不随鼠标移入新行更新 Margin / 表格数据 / 行高亮 */
      if (this.basicPriceRowTip.visible && this.basicPriceRowTip.pinned) {
        return
      }
      const el = (event && event.target) || cell
      const tr = el && el.closest ? el.closest('tr') : null
      if (!tr) return
      const { top, left } = this.calcBasicPriceRowTipPosition(tr)
      this.basicPriceActiveRowKey = row.margin
      this.openBasicPriceRowTip(row, top, left)
    },
    roundBasicPriceMargin(value) {
      const n = Number(value)
      if (Number.isNaN(n)) return null
      return Math.round(n * 100) / 100
    },
    openBasicPriceRowTip(tableRow, top, left) {
      const margin = this.roundBasicPriceMargin(
        tableRow != null && tableRow.margin != null ? tableRow.margin : 0
      )
      if (margin === null) return
      this.basicPriceRowTipMarginInput = margin
      const row = this.getBasicPriceByMargin(margin) || tableRow
      this.basicPriceRowTip = {
        visible: true,
        top,
        left,
        row,
        pinned: false
      }
    },
    onBasicPriceRowTipMarginChange(value) {
      if (value === undefined || value === null) return
      this.applyBasicPriceRowTipMargin(value)
    },
    refreshBasicPriceRowTip() {
      this.applyBasicPriceRowTipMargin(this.basicPriceRowTipMarginInput)
    },
    openQuotationReportDrawer() {
      const q = this.quotation
      const proj = this.theProjectAndPlanObj
      if (proj.project_code) q.project_code = proj.project_code
      if (proj.project_name) {
        q.project_name = proj.project_name
        if (q.project_info) q.project_info.project = proj.project_name
      }
      if (this.projectAndPlan.plan_code) q.plan_code = this.projectAndPlan.plan_code
      if (proj.seller) q.seller = proj.seller
      this.quotationReportDrawerVisible = true
    },
    applyBasicPriceRowTipMargin(value) {
      if (!this.basicPriceRowTip.visible) return
      const margin = this.roundBasicPriceMargin(value)
      if (margin === null || margin < 0 || margin >= 100) return
      const row = this.getBasicPriceByMargin(margin)
      if (!row) return
      this.basicPriceRowTip.row = { ...row, margin }
      this.basicPriceRowTipMarginInput = margin
    },
    onBasicPriceRowTipDragStart(e) {
      if (!this.basicPriceRowTip.visible) return
      this.basicPriceRowTipDrag.active = true
      this.basicPriceRowTipDrag.startX = e.clientX
      this.basicPriceRowTipDrag.startY = e.clientY
      this.basicPriceRowTipDrag.originLeft = this.basicPriceRowTip.left
      this.basicPriceRowTipDrag.originTop = this.basicPriceRowTip.top
      document.addEventListener('mousemove', this.onBasicPriceRowTipDragMove)
      document.addEventListener('mouseup', this.onBasicPriceRowTipDragEnd)
    },
    onBasicPriceRowTipDragMove(e) {
      if (!this.basicPriceRowTipDrag.active) return
      const tipW = 400
      const tipH = 280
      const m = 8
      const dx = e.clientX - this.basicPriceRowTipDrag.startX
      const dy = e.clientY - this.basicPriceRowTipDrag.startY
      let left = this.basicPriceRowTipDrag.originLeft + dx
      let top = this.basicPriceRowTipDrag.originTop + dy
      const maxL = window.innerWidth - tipW - m
      const maxT = window.innerHeight - tipH - m
      left = Math.min(Math.max(m, left), Math.max(m, maxL))
      top = Math.min(Math.max(m, top), Math.max(m, maxT))
      this.basicPriceRowTip.left = left
      this.basicPriceRowTip.top = top
    },
    onBasicPriceRowTipDragEnd() {
      if (!this.basicPriceRowTipDrag.active) return
      this.basicPriceRowTipDrag.active = false
      document.removeEventListener('mousemove', this.onBasicPriceRowTipDragMove)
      document.removeEventListener('mouseup', this.onBasicPriceRowTipDragEnd)
    },
    toggleBasicPriceRowTipPin() {
      if (!this.basicPriceRowTip.visible) return
      this.basicPriceRowTip.pinned = !this.basicPriceRowTip.pinned
      this.cancelBasicPriceRowTipHide()
    },
    closeBasicPriceRowTip() {
      this.cancelBasicPriceRowTipHide()
      this.onBasicPriceRowTipDragEnd()
      this.basicPriceRowTip.visible = false
      this.basicPriceRowTip.row = null
      this.basicPriceRowTip.pinned = false
      this.basicPriceActiveRowKey = null
      this.basicPriceRowTipMarginInput = 0
    },
    onBasicPriceRowTipMouseLeave() {
      if (!this.basicPriceRowTip.pinned) {
        this.scheduleBasicPriceRowTipHide()
      }
    },
    basicPriceRowClassName({ row }) {
      if (this.basicPriceActiveRowKey !== null && row && row.margin === this.basicPriceActiveRowKey) {
        return 'basic-price-row--active'
      }
      return ''
    },
    onBasicPriceRowLeave() {
      if (this.basicPriceRowTip.pinned) return
      this.scheduleBasicPriceRowTipHide()
    },
    scheduleBasicPriceRowTipHide() {
      if (this.basicPriceRowTip.pinned) return
      this.cancelBasicPriceRowTipHide()
      this.basicPriceRowTipHideTimer = setTimeout(() => {
        this.basicPriceRowTip.visible = false
        this.basicPriceRowTip.row = null
        this.basicPriceRowTip.pinned = false
        this.basicPriceActiveRowKey = null
        this.basicPriceRowTipMarginInput = 0
      }, 240)
    },
    cancelBasicPriceRowTipHide() {
      if (this.basicPriceRowTipHideTimer) {
        clearTimeout(this.basicPriceRowTipHideTimer)
        this.basicPriceRowTipHideTimer = null
      }
    },
    formatBasicPriceTipValue(row, currencyKey, term) {
      if (!row || !currencyKey || !term) return ''
      const cellValue = row[`${currencyKey}_${term}`]
      if (typeof cellValue === 'number') {
        return this.formatSignificantDigits(cellValue, 8)
      }
      return cellValue == null ? '' : cellValue
    },
    /** 保留指定位有效数字；末位为 0 时保留，便于表格对齐 */
    formatSignificantDigits(value, digits = 6) {
      if (typeof value !== 'number' || Number.isNaN(value)) return value == null ? '' : value
      if (value === 0) return ''
      const precisionStr = value.toPrecision(digits)
      if (!/e/i.test(precisionStr)) {
        return precisionStr
      }
      const n = Number(precisionStr)
      const exp = Math.floor(Math.log10(Math.abs(n)))
      return n.toFixed(Math.max(0, digits - 1 - exp))
    },
    // 初始化要输入内容（无 planResult 时 process_site 为空、guide_days 为 0；汇率由 getExchangeRate 拉取）
    initForm(planResult) {
      const hasPlan = planResult && typeof planResult === 'object'
      this.form = {
        exchange_rate_usd: '',
        exchange_rate_eur: '',
        exchange_rate_handling_fee: 1.5,
        guide_fee: 250,
        guide_days: hasPlan ? this.getDayOfService(planResult.planCapacity) : 0,
        guarantee_and_financial_fees: 0,
        other_additional_fees: 0,
        guide_fee_switch: true,
        guarantee_and_financial_fees_switch: true,
        other_additional_fees_switch: true,
        process_site: hasPlan ? this.getProcessSiteInfo(planResult) : []
      }
      this.getExchangeRate()
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
            name: this.tr('立柱', 'Post'),
            totalPrice: prt.reduce((a, b) => a + b.trackTotalPostPriceSpare, 0),
            totalWeight: prt.reduce((a, b) => a + b.trackTotalPostWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalPostPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalPostWeightSpare, 0) / totalCapacity,
            processingSite: this.processingSiteText(plan.process_site.post)
          },
          {
            name: this.tr('主梁', 'Torque Tube'),
            totalPrice: prt.reduce((a, b) => a + b.trackTotalBeamPriceSpare, 0),
            totalWeight: prt.reduce((a, b) => a + b.trackTotalBeamWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalBeamPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalBeamWeightSpare, 0) / totalCapacity,
            processingSite: this.processingSiteText(plan.process_site.beam)
          },
          {
            name: this.tr('檩条', 'Purlin'),
            totalPrice: prt.reduce((a, b) => a + b.trackTotalPurlinPriceSpare, 0),
            totalWeight: prt.reduce((a, b) => a + b.trackTotalPurlinWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalPurlinPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalPurlinWeightSpare, 0) / totalCapacity,
            processingSite: this.processingSiteText(plan.process_site.purlin)
          },
          {
            name: 'Other',
            totalPrice: prt.reduce((a, b) => a + b.trackTotalOtherPriceSpare, 0) + plan.weatherStationTotalPrice,
            totalWeight: prt.reduce((a, b) => a + b.trackTotalOtherWeightSpare, 0),
            pricePerWatt: prt.reduce((a, b) => a + b.trackTotalOtherPriceSpare, 0) / totalCapacity,
            tonPerMw: 1000 * prt.reduce((a, b) => a + b.trackTotalOtherWeightSpare, 0) / totalCapacity,
            processingSite: this.tr('国内', 'Domestic')
          }
        ]
      }
      return mf
    },
    //生产地翻译
    processingSiteText(site) {
      if (site === '国内') return this.tr('国内', 'Domestic')
      else if (site === '沙特') return this.tr('沙特', 'Saudi')
      else if (site === '土耳其') return this.tr('土耳其', 'Turkey')
      else return this.tr(site, site)
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
    /** 请求接口并解析美元、欧元汇率 */
    fetchExchangeRates() {
      return fetch(process.env.VUE_APP_BASE_API + '/api/getExchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: {}
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong on server side.')
        })
        .then(r => {
          const rates = r.data.replace('}', ',}')
          return {
            exchange_rate_usd: (rates.split('usd:')[1].split(',')[0] / 100).toFixed(4),
            exchange_rate_eur: (rates.split('eur:')[1].split(',')[0] / 100).toFixed(4)
          }
        })
    },
    /**
     * 获取美元和欧元即期汇率的现汇买入价（initForm / 刷新按钮共用）
     * @returns {Promise<void>|undefined}
     */
    getExchangeRate() {
      if (!this.form || typeof this.form !== 'object') return
      this.exchangeRateLoading = true
      return this.fetchExchangeRates()
        .then(({ exchange_rate_usd, exchange_rate_eur }) => {
          this.form.exchange_rate_usd = exchange_rate_usd
          this.form.exchange_rate_eur = exchange_rate_eur
        })
        .catch(error => {
          console.error('Error:', error)
        })
        .finally(() => {
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
    /** 四舍五入为整数显示 */
    formatInteger(row, column, cellValue) {
      if (typeof cellValue === 'number' && !isNaN(cellValue)) {
        return Math.round(cellValue)
      }
      const n = parseFloat(cellValue)
      if (!isNaN(n)) {
        return Math.round(n)
      }
      return cellValue == null ? '' : cellValue
    },
    /** 固定保留两位小数（含 0 显示为 0.00） */
    formatFixed4(row, column, cellValue) {
      if (typeof cellValue === 'number' && !isNaN(cellValue)) {
        return cellValue.toFixed(4)
      }
      const n = parseFloat(cellValue)
      if (!isNaN(n)) {
        return n.toFixed(4)
      }
      return cellValue == null ? '' : cellValue
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
    // this.initForm(this.planResult)
    this.initHeadTitlePosition()
    this.getFormInfo()
    window.addEventListener('resize', this.onHeadTitleViewportResize)
  },
  beforeDestroy() {
    this.cancelBasicPriceRowTipHide()
    this.cancelPileDetailTipHide()
    this.onBasicPriceRowTipDragEnd()
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

.fee-div--has-save-btn {
  position: relative;
  padding-bottom: 72px;
}

.fee-div__save-btn {
  position: absolute;
  right: 20px;
  bottom: 30px;
  margin: 0;
  z-index: 1;
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
  background: linear-gradient(155deg,
      rgba(125, 211, 252, 0.5) 0%,
      rgba(56, 189, 248, 0.5) 45%,
      rgba(14, 165, 233, 0.5) 100%);
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

.head-title--minimized .head-title__drag-bar {
  border-bottom: none;
}

.head-title__drag-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: grab;
  background: linear-gradient(90deg,
      rgba(186, 230, 253, 0.5) 0%,
      rgba(125, 211, 252, 0.5) 50%,
      rgba(56, 189, 248, 0.5) 100%);
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

.head-title__summary {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 12px;
  color: #075985;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.head-title__toggle-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.35);
  color: #075985;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.head-title__toggle-btn:hover {
  background: rgba(255, 255, 255, 0.55);
  color: #0284c7;
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

/* 毛利率表行悬停详情 */
.basic-price-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 12px;
}

.basic-price-filters__label {
  font-size: 13px;
  color: #606266;
}

.basic-price-filters__select {
  width: 280px;
}

/* 檩条、螺栓列：与前面列一致，不使用末尾备品价格列暖色样式 */
.tracker-corrosion-info-table-wrap ::v-deep .el-table__header-wrapper thead th:nth-child(7),
.tracker-corrosion-info-table-wrap ::v-deep .el-table__header-wrapper thead th:nth-child(8),
.tracker-corrosion-info-table-wrap ::v-deep .el-table__header-wrapper thead th:nth-child(9),
.tracker-corrosion-info-table-wrap ::v-deep .el-table__header-wrapper thead th.corrosion-info-col-plain {
  background: linear-gradient(180deg, #f0f4f8 0%, #e4ebf2 100%) !important;
  color: #303133 !important;
  font-weight: 600 !important;
}

.tracker-corrosion-info-table-wrap ::v-deep td.corrosion-info-col-plain,
.tracker-corrosion-info-table-wrap ::v-deep .el-table__body-wrapper tbody td:nth-child(7),
.tracker-corrosion-info-table-wrap ::v-deep .el-table__body-wrapper tbody td:nth-child(8),
.tracker-corrosion-info-table-wrap ::v-deep .el-table__body-wrapper tbody td:nth-child(9) {
  background-color: #fff !important;
}

.tracker-corrosion-info-table-wrap ::v-deep tr.el-table__row--striped td.corrosion-info-col-plain,
.tracker-corrosion-info-table-wrap ::v-deep tr.el-table__row--striped td:nth-child(7),
.tracker-corrosion-info-table-wrap ::v-deep tr.el-table__row--striped td:nth-child(8),
.tracker-corrosion-info-table-wrap ::v-deep tr.el-table__row--striped td:nth-child(9) {
  background-color: #fafbfc !important;
}

.tracker-corrosion-info-table-wrap ::v-deep tr:hover>td.corrosion-info-col-plain,
.tracker-corrosion-info-table-wrap ::v-deep tr:hover>td:nth-child(7),
.tracker-corrosion-info-table-wrap ::v-deep tr:hover>td:nth-child(8),
.tracker-corrosion-info-table-wrap ::v-deep tr:hover>td:nth-child(9) {
  background-color: #ecf5ff !important;
}

.pile-info-table-wrap {
  position: relative;
}

/* 平均深度列：与桩总数等普通列一致，不使用末尾价格列暖色样式 */
.pile-info-table-wrap ::v-deep .el-table__header-wrapper thead th:nth-child(7),
.pile-info-table-wrap ::v-deep .el-table__header-wrapper thead th.pile-info-col-plain {
  background: linear-gradient(180deg, #f0f4f8 0%, #e4ebf2 100%) !important;
  color: #303133 !important;
  font-weight: 600 !important;
}

.pile-info-table-wrap ::v-deep td.pile-info-col-plain,
.pile-info-table-wrap ::v-deep .el-table__body-wrapper tbody td:nth-child(7) {
  background-color: #fff !important;
}

.pile-info-table-wrap ::v-deep tr.el-table__row--striped td.pile-info-col-plain,
.pile-info-table-wrap ::v-deep tr.el-table__row--striped td:nth-child(7) {
  background-color: #fafbfc !important;
}

.pile-info-table-wrap ::v-deep tr:hover>td.pile-info-col-plain,
.pile-info-table-wrap ::v-deep tr:hover>td:nth-child(7) {
  background-color: #ecf5ff !important;
}

.pile-info-table-wrap ::v-deep tr.summary-plan-table__row-total>td.pile-info-col-plain,
.pile-info-table-wrap ::v-deep tr.summary-plan-table__row-total>td:nth-child(7) {
  background: linear-gradient(180deg, #d9ecff 0%, #c5ddf5 100%) !important;
  color: #1f2d3d !important;
}

.pile-info-table-wrap ::v-deep tr.summary-plan-table__row-total:hover>td.pile-info-col-plain,
.pile-info-table-wrap ::v-deep tr.summary-plan-table__row-total:hover>td:nth-child(7) {
  background: linear-gradient(180deg, #cce4f9 0%, #b8d4f0 100%) !important;
}

.pile-info-table-wrap ::v-deep tr.pile-info-row--active>td {
  background-color: #d9ecff !important;
}

.pile-info-table-wrap ::v-deep tr.pile-info-row--active:hover>td {
  background-color: #c6e2ff !important;
}

.pile-detail-trigger {
  color: #409eff;
  cursor: default;
  font-size: 13px;
}

.pile-detail-tip {
  position: fixed;
  z-index: 3000;
  width: 720px;
  max-height: 420px;
  padding: 10px 12px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  pointer-events: auto;
}

.pile-detail-tip__title {
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

.pile-detail-tip__table {
  width: 100%;
}

.basic-price-table-wrap {
  position: relative;
}

.basic-price-table-wrap ::v-deep tr.basic-price-row--active>td {
  background-color: #d9ecff !important;
}

.basic-price-table-wrap ::v-deep tr.basic-price-row--active:hover>td {
  background-color: #c6e2ff !important;
}

.basic-price-row-tip {
  position: fixed;
  z-index: 3000;
  width: 400px;
  max-height: 420px;
  overflow-y: auto;
  padding: 10px 12px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  pointer-events: auto;
}

.basic-price-row-tip--pinned {
  border-color: #409eff;
  box-shadow: 0 8px 28px rgba(64, 158, 255, 0.22);
}

.basic-price-row-tip--dragging {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  user-select: none;
}

.basic-price-row-tip__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  cursor: grab;
  user-select: none;
}

.basic-price-row-tip--dragging .basic-price-row-tip__header {
  cursor: grabbing;
}

.basic-price-row-tip__title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  min-width: 0;
}

.basic-price-row-tip__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;
}

.basic-price-row-tip__action-btn {
  padding: 4px !important;
  min-width: 24px !important;
  color: #909399 !important;
}

.basic-price-row-tip__action-btn:hover {
  color: #409eff !important;
}

.basic-price-row-tip__action-btn--active {
  color: #409eff !important;
}

.basic-price-row-tip__action-btn--close:hover {
  color: #f56c6c !important;
}

.basic-price-row-tip__margin {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

.basic-price-row-tip__margin-label {
  flex-shrink: 0;
  font-size: 12px;
  color: #606266;
}

.basic-price-row-tip__margin-input {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.basic-price-row-tip__margin-input ::v-deep .el-input__inner {
  text-align: left;
}

.basic-price-row-tip__margin-unit {
  flex-shrink: 0;
  font-size: 12px;
  color: #606266;
}

.basic-price-row-tip__refresh-btn,
.basic-price-row-tip__quotation-btn {
  flex-shrink: 0;
  padding: 7px 10px !important;
}

.basic-price-row-tip__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}

.basic-price-row-tip__table-corner {
  width: 44px;
}

.basic-price-row-tip__table-head {
  padding: 6px 4px;
  text-align: center;
  font-weight: 600;
  color: #606266;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  line-height: 1.3;
}

.basic-price-row-tip__table-term {
  padding: 6px 4px;
  text-align: center;
  font-weight: 600;
  color: #409eff;
  text-transform: uppercase;
  background: #fafafa;
  border: 1px solid #ebeef5;
}

.basic-price-row-tip__table-cell {
  padding: 6px 4px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: #303133;
  border: 1px solid #ebeef5;
  word-break: break-all;
}
</style>

<style lang="scss">
.result-for-seller__quotation-drawer .el-drawer__body {
  padding: 0;
  overflow: hidden;
  height: calc(100% - 55px);
  box-sizing: border-box;
}

.result-for-seller__quotation-scroll {
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  padding: 0 16px 16px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
</style>
