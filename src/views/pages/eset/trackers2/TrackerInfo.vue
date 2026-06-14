<template>
  <div
    class="tracker-card"
    :class="{ 'tracker-card--minimized': minimized }"
    :style="{ backgroundColor: tracker.rowColor }"
  >
    <div
      class="tracker-card__header"
      :class="{ 'tracker-card__header--minimized': minimized }"
    >
      <h2 ref="titleEl" class="tracker-card__title" :title="trackerTitleFull">
        <span ref="titleNameEl" class="tracker-card__title-name">{{ paddedTrackerBriefName }}</span>
        <span
          v-if="trackerDisplayId && showTrackerId"
          class="tracker-card__title-id"
        >[{{ trackerDisplayId }}]</span>
        
        <span
          v-if="trackerDisplayId"
          ref="titleIdMeasureEl"
          class="tracker-card__title-id tracker-card__title-id--measure"
          aria-hidden="true"
        >[{{ trackerDisplayId }}]</span>
      </h2>
      <div v-if="minimized" class="tracker-card__header-qty">
        <span class="tracker-card__header-qty-label">支架数量</span>
        <el-input
          v-model="tracker.trackerNum"
          size="mini"
          class="tracker-card__header-qty-input"
          @change="normalizeTrackerNum"
        />
      </div>
      <div class="tracker-card__header-actions">
        <button
          v-if="hasBomData"
          type="button"
          class="tracker-card__bom-btn"
          :class="{ 'tracker-card__bom-btn--alert': hasBomError }"
          :title="hasBomError ? '查看BOM结果（存在异常）' : '查看BOM结果'"
          @click.stop="openBom"
        >
          BOM
        </button>
        <button
          type="button"
          class="tracker-card__toggle-btn"
          :title="minimized ? '恢复' : '最小化'"
          @click.stop="toggleMinimize"
        >
          <i :class="minimized ? 'el-icon-full-screen' : 'el-icon-minus'"></i>
        </button>
      </div>
    </div>
    <div v-show="showBody" class="tracker-card__body">
      <div class="tracker-card__watermark-layer" aria-hidden="true">
        <span
          v-for="item in watermarkItems"
          :key="item.id"
          class="tracker-card__watermark-item"
          :style="watermarkStyle"
        >
          <span class="tracker-card__watermark-brand">ESET</span>
          <span class="tracker-card__watermark-name">{{ tracker.trackBrifeName }}</span>
        </span>
      </div>
      <div class="tracker-card__pic">
        <TrackerInfoPic :tracker="tracker" />
      </div>
    <div class="section-block">
      <h3 class="section-block__title">支架概览</h3>
      <div class="section-block__content">
        <div class="field-grid field-grid--tracker">
          <div class="field-cell">
            <span class="field-cell__label">支架数量</span>
            <el-input
              v-model="tracker.trackerNum"
              size="small"
              class="field-cell__input"
              @change="normalizeTrackerNum"
            /><span class="field-cell__label">套</span>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">产品系列</span>
            <el-select v-model="tracker.product_system" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.product_system_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">组件排布</span>
            <el-select v-model="tracker.pv_layout" size="small" class="field-cell__select">
              <el-option label="1P" value="1p"/>
              <el-option label="2P" value="2p"/>
            </el-select>
            <span class="field-cell__label">{{ tracker.pv_iftp ? '通铺' : '不通铺' }}</span>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">组件容量</span>
            <el-input v-model="tracker.pv_capacity" size="small" class="field-cell__input" />
            <span class="field-cell__label">Wp</span>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">供电方式</span>
            <el-select v-model="tracker.power_supply" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.power_supply_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="section-block">
      <h3 class="section-block__title">主材品牌</h3>
      <div class="section-block__content">
        <div class="field-grid field-grid--tracker">
          <div class="field-cell">
            <span class="field-cell__label">主梁品牌</span>
            <el-select v-model="tracker.beam_brand" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.beam_brand_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">檩条品牌</span>
            <el-select v-model="tracker.purlin_brand" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.purlin_brand_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="section-block">
      <h3 class="section-block__title">防腐</h3>
      <div class="section-block__content">
        <div class="field-row field-row--single">
          <span class="field-row__label">防腐等级</span>
          <el-select v-model="tracker.corrosion_proofing_grade" size="small" class="field-cell__select field-cell__select--inline">
            <el-option
              v-for="opt in select_option.corrosion_proofing_grade_options"
              :key="opt.value"
              :label="opt.text"
              :value="opt.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="section-block">
      <h3 class="section-block__title">表面处理</h3>
      <div class="section-block__content">
        <div class="field-grid field-grid--tracker field-grid--surface">
          <div class="field-cell">
            <span class="field-cell__label">立柱防腐</span>
            <el-select v-model="tracker.post_galvanizin_thickness" size="small" class="field-cell__select field-cell__select--surface">
              <el-option
                v-for="opt in select_option.post_galvanizin_thickness_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">主梁防腐</span>
            <el-select v-model="tracker.beam_galvanizin_thickness" size="small" class="field-cell__select field-cell__select--surface">
              <el-option
                v-for="opt in select_option.beam_galvanizin_thickness_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">檩条防腐</span>
            <el-select v-model="tracker.purlin_galvanizin_thickness" size="small" class="field-cell__select field-cell__select--surface">
              <el-option
                v-for="opt in select_option.purlin_galvanizin_thickness_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="section-block">
      <h3 class="section-block__title">减速机</h3>
      <div class="section-block__content">
        <div class="field-grid field-grid--tracker">
          <div class="field-cell">
            <span class="field-cell__label">型号</span>
            <el-select v-model="tracker.slew_drive_inch" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.slew_drive_inch_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">减速机罩</span>
            <el-select v-model="tracker.slew_cover_if_need" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.slew_cover_if_need_options"
                :key="String(opt.value)"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="section-block">
      <h3 class="section-block__title">阻尼器</h3>
      <div class="section-block__content">
        <div class="field-grid field-grid--tracker">
          <div class="field-cell">
            <span class="field-cell__label">阻尼套数</span>
            <el-select v-model="tracker.dumper_num" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.dumper_num_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">阻尼型号</span>
            <el-select v-model="tracker.dumper_type" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.dumper_type_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="field-cell">
            <span class="field-cell__label">弹簧阻尼</span>
            <el-select v-model="tracker.spring_damper_num" size="small" class="field-cell__select">
              <el-option
                v-for="opt in select_option.spring_damper_num_options"
                :key="opt.value"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="section-block">
      <h3 class="section-block__title">光伏组件安装信息</h3>
      <div class="section-block__content">
        <div class="purlin-toolbar">
          <div class="field-cell">
            <span class="field-cell__label">檩条总根数</span>
            <el-input v-model="tracker.purlinCount" size="small" class="field-cell__input" />
          </div>
          <el-button type="primary" size="mini" plain @click="addPurlin">添加檩条</el-button>
        </div>
        <div
          v-for="(purlin, index) in purlinList"
          :key="purlin.id"
          class="purlin-item"
        >
          <div class="purlin-item__header">
            <span class="purlin-item__label">
              截面型号 / 长度 / 材质 / 数量{{ purlinList.length > 1 ? ` ${index + 1}` : '' }}
            </span>
            <el-button type="text" size="mini" class="purlin-item__delete" @click="deletePurlin(purlin.id)">删除</el-button>
          </div>
          <div class="field-grid field-grid--purlin">
            <div class="field-cell field-cell--purlin-section">
              <span class="field-cell__label">截面型号</span>
              <el-select
                v-model="purlin.section"
                size="small"
                class="field-cell__select field-cell__select--purlin-section"
                filterable
                allow-create
                default-first-option
                placeholder="选择或输入截面"
              >
                <el-option
                  v-for="opt in select_option.purlin_section_options"
                  :key="opt.value"
                  :label="opt.text"
                  :value="opt.value"
                />
              </el-select>
              <el-button
                type="primary"
                size="mini"
                plain
                class="field-cell__action-btn"
                @click="openCustomPurlinSection(purlin)"
              >
                自定义截面
              </el-button>
            </div>
            <div class="field-cell">
              <span class="field-cell__label">长度</span>
              <el-select v-model="purlin.length" size="small" class="field-cell__select">
                <el-option
                  v-for="opt in select_option.purlin_length_options"
                  :key="opt.value"
                  :label="opt.text"
                  :value="opt.value"
                />
              </el-select>
            </div>
            <div class="field-cell">
              <span class="field-cell__label">材质</span>
              <el-select v-model="purlin.material" size="small" class="field-cell__select">
                <el-option
                  v-for="opt in select_option.purlin_material_options"
                  :key="opt.value"
                  :label="opt.text"
                  :value="opt.value"
                />
              </el-select>
            </div>
            <div class="field-cell field-cell--purlin-amount">
              <span class="field-cell__label">数量</span>
              <el-input v-model="purlin.amount" size="small" class="field-cell__input field-cell__input--purlin-amount" />
            </div>
          </div>
          <div class="field-grid field-grid--purlin-install">
            <div class="field-cell">
              <span class="field-cell__label">组件安装</span>
              <el-select v-model="purlin.installPoints" size="small" class="field-cell__select">
                <el-option
                  v-for="opt in select_option.install_points_options"
                  :key="opt.value"
                  :label="opt.text"
                  :value="opt.value"
                />
              </el-select>
            </div>
            <div class="field-cell">
              <span class="field-cell__label">安装垫片</span>
              <el-select v-model="purlin.blockNeed" size="small" class="field-cell__select">
                <el-option
                  v-for="opt in select_option.block_need_options"
                  :key="String(opt.value)"
                  :label="opt.text"
                  :value="opt.value"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <PurlinCustomSectionDialog
      :visible.sync="customSectionVisible"
      :initial-section="customSectionInitialSection"
      @confirm="handleCustomSectionConfirm"
    />
  </div>
</template>

<script>
import TrackerInfoPic from '@/views/pages/eset/trackers2/TrackerInfoPic.vue'
import PurlinCustomSectionDialog from '@/views/pages/eset/trackers2/PurlinCustomSectionDialog.vue'

export default {
  name: 'TrackerInfo',

  components: {
    TrackerInfoPic,
    PurlinCustomSectionDialog
  },

  props: {
    tracker: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showTrackerId: true,
      titleResizeObserver: null,
      customSectionVisible: false,
      customSectionTarget: null,
      select_option: {
        product_system_options: [
          { text: '二代单排', value: 'single_row' },
          // { text: '二代双排(M)', value: 'double_row-M' },
          // { text: '二代双排(E)', value: 'double_row-E' },
          { text: '三代(通铺)', value: '3Gen_tracker_no_gap' },
          { text: '三代(非通铺)', value: '3Gen_tracker' }
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
        ],
        purlin_section_options: [
          { text: '-1.4x30x30x50', value: '-1.4x30x30x50' },
          { text: '-1.5x30x30x50', value: '-1.5x30x30x50' },
          { text: '-1.6x30x30x50', value: '-1.6x30x30x50' },
          { text: '-1.7x30x30x50', value: '-1.7x30x30x50' },
          { text: '-1.8x30x30x50', value: '-1.8x30x30x50' },
          { text: '-1.9x30x30x50', value: '-1.9x30x30x50' },
          { text: '-2.0x30x30x50', value: '-2.0x30x30x50' },
          { text: '-2.1x30x30x50', value: '-2.1x30x30x50' },
          { text: '-2.2x30x30x50', value: '-2.2x30x30x50' },
          { text: '-2.3x30x30x50', value: '-2.3x30x30x50' },
          { text: '-2.4x30x30x50', value: '-2.4x30x30x50' },
          { text: '-2.5x30x30x50', value: '-2.5x30x30x50' },
          { text: '-1.4x30x30x60', value: '-1.4x30x30x60' },
          { text: '-1.5x30x30x60', value: '-1.5x30x30x60' },
          { text: '-1.6x30x30x60', value: '-1.6x30x30x60' },
          { text: '-1.7x30x30x60', value: '-1.7x30x30x60' },
          { text: '-1.8x30x30x60', value: '-1.8x30x30x60' },
          { text: '-1.9x30x30x60', value: '-1.9x30x30x60' },
          { text: '-2.0x30x30x60', value: '-2.0x30x30x60' },
          { text: '-2.1x30x30x60', value: '-2.1x30x30x60' },
          { text: '-2.2x30x30x60', value: '-2.2x30x30x60' },
          { text: '-2.3x30x30x60', value: '-2.3x30x30x60' },
          { text: '-2.4x30x30x60', value: '-2.4x30x30x60' },
          { text: '-2.5x30x30x60', value: '-2.5x30x30x60' },
          { text: '-1.4x30x30x70', value: '-1.4x30x30x70' },
          { text: '-1.5x30x30x70', value: '-1.5x30x30x70' },
          { text: '-1.6x30x30x70', value: '-1.6x30x30x70' },
          { text: '-1.7x30x30x70', value: '-1.7x30x30x70' },
          { text: '-1.8x30x30x70', value: '-1.8x30x30x70' },
          { text: '-1.9x30x30x70', value: '-1.9x30x30x70' },
          { text: '-2.0x30x30x70', value: '-2.0x30x30x70' },
          { text: '-2.1x30x30x70', value: '-2.1x30x30x70' },
          { text: '-2.2x30x30x70', value: '-2.2x30x30x70' },
          { text: '-2.3x30x30x70', value: '-2.3x30x30x70' },
          { text: '-2.4x30x30x70', value: '-2.4x30x30x70' },
          { text: '-2.5x30x30x70', value: '-2.5x30x30x70' },
          { text: '-1.4x30x30x80', value: '-1.4x30x30x80' },
          { text: '-1.5x30x30x80', value: '-1.5x30x30x80' },
          { text: '-1.6x30x30x80', value: '-1.6x30x30x80' },
          { text: '-1.7x30x30x80', value: '-1.7x30x30x80' },
          { text: '-1.8x30x30x80', value: '-1.8x30x30x80' },
          { text: '-1.9x30x30x80', value: '-1.9x30x30x80' },
          { text: '-2.0x30x30x80', value: '-2.0x30x30x80' },
          { text: '-2.1x30x30x80', value: '-2.1x30x30x80' },
          { text: '-2.2x30x30x80', value: '-2.2x30x30x80' },
          { text: '-2.3x30x30x80', value: '-2.3x30x30x80' },
          { text: '-2.4x30x30x80', value: '-2.4x30x30x80' },
          { text: '-2.5x30x30x80', value: '-2.5x30x30x80' }
        ],
        purlin_length_options: [
          { text: '450', value: '450' },
          { text: '840', value: '840' },
          { text: '1450', value: '1450' },
          { text: '1650', value: '1650' },
          { text: '1980', value: '1980' }
        ],
        purlin_material_options: [
          { text: 'S420GD', value: 'S420GD' },
          { text: 'S450GD', value: 'S450GD' },
          { text: 'S500GD', value: 'S500GD' }
        ],
        install_points_options: [
          { text: '4*M6', value: '4*M6' },
          { text: '4*M8', value: '4*M8' },
          { text: '4*M6+4*M8', value: '4*M6+4*M8' },
          { text: '8*M6', value: '8*M6' },
          { text: '8*M8', value: '8*M8' }
        ],
        block_need_options: [
          { text: '选配组件安装垫片', value: true },
          { text: '不选配组件安装垫片', value: false }
        ]
      }
    }
  },
  computed: {
    purlinList() {
      return this.tracker.purlin_info_lst || []
    },

    customSectionInitialSection() {
      return this.customSectionTarget && this.customSectionTarget.section != null
        ? this.customSectionTarget.section
        : ''
    },

    hasBomData() {
      const bom1 = this.tracker.resultList && this.tracker.resultList.bom1
      return Array.isArray(bom1) && bom1.length > 0
    },

    hasBomError() {
      const bomErr = this.tracker.resultList && this.tracker.resultList.bomErr
      return Array.isArray(bomErr) && bomErr.length > 0
    },

    minimized: {
      get() {
        return !!this.tracker.uiMinimized
      },
      set(value) {
        this.$set(this.tracker, 'uiMinimized', !!value)
      }
    },

    showBody() {
      return !this.minimized
    },

    trackerDisplayId() {
      const rawId = this.tracker.id || ''
      if (!rawId) {
        return ''
      }

      const txtIndex = rawId.indexOf('.txt')
      return txtIndex !== -1 ? rawId.substring(0, txtIndex) : rawId
    },

    paddedTrackerBriefName() {
      const name = String(this.tracker.trackBrifeName || '')
      if (name.length >= 16) {
        return name.slice(0, 16)
      }
      return name + ' '.repeat(16 - name.length)
    },

    trackerTitleFull() {
      const name = this.tracker.trackBrifeName || ''
      if (!this.trackerDisplayId) {
        return name
      }
      return `${name}[${this.trackerDisplayId}]`
    },

    watermarkStyle() {
      const bg = (this.tracker.rowColor || '').trim().toUpperCase()
      const presetMap = {
        '#FF3366': {
          color: 'rgba(100, 0, 35, 0.38)',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.35)'
        },
        '#FFFFCC': {
          color: 'rgba(130, 95, 0, 0.34)',
          textShadow: 'none'
        },
        '#33FF99': {
          color: 'rgba(0, 95, 58, 0.36)',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)'
        }
      }

      if (presetMap[bg]) {
        return presetMap[bg]
      }

      return this.getAdaptiveWatermarkStyle(bg)
    },

    watermarkItems() {
      return Array.from({ length: 12 }, (_, index) => ({ id: index }))
    }
  },

  watch: {
    trackerTitleFull() {
      this.scheduleTitleLayoutUpdate()
    },

    minimized() {
      this.scheduleTitleLayoutUpdate()
    }
  },

  mounted() {
    console.log(this.tracker)
    this.initTitleResponsive()
  },

  beforeDestroy() {
    this.destroyTitleResponsive()
  },

  methods: {
    getAdaptiveWatermarkStyle(bgColor) {
      const rgb = this.parseHexColor(bgColor)
      if (!rgb) {
        return { color: 'rgba(0, 0, 0, 0.28)' }
      }

      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
      const isReddish = rgb.r > 180 && rgb.g < 130 && rgb.b < 160
      const isYellowish = rgb.r > 200 && rgb.g > 200 && rgb.b < 180
      const isGreenish = rgb.g > rgb.r + 30 && rgb.g > 120

      if (isReddish) {
        return {
          color: 'rgba(100, 0, 35, 0.38)',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.35)'
        }
      }
      if (isYellowish) {
        return { color: 'rgba(130, 95, 0, 0.34)' }
      }
      if (isGreenish) {
        return {
          color: 'rgba(0, 95, 58, 0.36)',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)'
        }
      }
      if (luminance > 0.65) {
        return { color: 'rgba(0, 0, 0, 0.26)' }
      }
      return {
        color: 'rgba(255, 255, 255, 0.34)',
        textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
      }
    },

    parseHexColor(color) {
      if (!color) {
        return null
      }
      const hex = color.trim().replace('#', '')
      if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
        return null
      }
      const normalized = hex.length === 3
        ? hex.split('').map((c) => c + c).join('')
        : hex
      return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16)
      }
    },

    initTitleResponsive() {
      this.$nextTick(() => {
        const header = this.$el && this.$el.querySelector('.tracker-card__header')
        if (!header) {
          return
        }

        this.updateTitleIdVisibility()

        if (typeof ResizeObserver !== 'undefined') {
          this.titleResizeObserver = new ResizeObserver(() => {
            this.updateTitleIdVisibility()
          })
          this.titleResizeObserver.observe(header)
        } else {
          window.addEventListener('resize', this.updateTitleIdVisibility)
        }
      })
    },

    destroyTitleResponsive() {
      if (this.titleResizeObserver) {
        this.titleResizeObserver.disconnect()
        this.titleResizeObserver = null
      }
      window.removeEventListener('resize', this.updateTitleIdVisibility)
    },

    scheduleTitleLayoutUpdate() {
      this.$nextTick(() => {
        this.updateTitleIdVisibility()
      })
    },

    updateTitleIdVisibility() {
      const header = this.$el && this.$el.querySelector('.tracker-card__header')
      const titleNameEl = this.$refs.titleNameEl
      const titleIdMeasureEl = this.$refs.titleIdMeasureEl

      if (!this.trackerDisplayId) {
        this.showTrackerId = false
        return
      }

      if (!header || !titleNameEl || !titleIdMeasureEl) {
        this.showTrackerId = true
        return
      }

      const headerGap = 10
      let reservedWidth = 0
      Array.from(header.children).forEach((child) => {
        if (child === this.$refs.titleEl) {
          return
        }
        if (child.offsetWidth > 0) {
          reservedWidth += child.offsetWidth + headerGap
        }
      })

      const availableWidth = header.clientWidth - reservedWidth
      const requiredWidth = titleNameEl.offsetWidth + titleIdMeasureEl.offsetWidth

      this.showTrackerId = availableWidth >= requiredWidth
    },

    toggleMinimize() {
      this.minimized = !this.minimized
    },

    openBom() {
      if (!this.hasBomData) {
        return
      }
      this.$emit('open-bom', this.tracker.id)
    },

    normalizeTrackerNum() {
      let num = parseInt(this.tracker.trackerNum, 10)
      if (isNaN(num) || num < 0) {
        num = 0
      }
      this.tracker.trackerNum = num
    },

    addPurlin() {
      if (!this.tracker.purlin_info_lst) {
        this.$set(this.tracker, 'purlin_info_lst', [])
      }

      const nid = Math.floor(Math.random() * (999 - 100 + 1)) + 100
      this.tracker.purlin_info_lst.push({
        id: nid,
        material: 'S450GD',
        section: '-1.5x30x30x60',
        length: 1450,
        amount: 0,
        installPoints: '4*M6',
        blockNeed: false
      })
    },

    deletePurlin(pid) {
      if (!this.tracker.purlin_info_lst) {
        return
      }
      this.tracker.purlin_info_lst = this.tracker.purlin_info_lst.filter(item => item.id !== pid)
    },

    openCustomPurlinSection(purlin) {
      this.customSectionTarget = purlin
      this.customSectionVisible = true
    },

    handleCustomSectionConfirm(section) {
      if (this.customSectionTarget) {
        this.customSectionTarget.section = section
        this.ensurePurlinSectionOption(section)
      }
      this.customSectionTarget = null
    },

    ensurePurlinSectionOption(section) {
      const options = this.select_option.purlin_section_options
      if (!options.some((item) => item.value === section)) {
        options.push({ text: section, value: section })
      }
    }
  }

}
</script>

<style scoped>
.tracker-card {
  padding: 12px 14px;
  border-radius: 8px;
  overflow: hidden;
}

.tracker-card--minimized {
  padding-bottom: 0;
  overflow: visible;
}

.tracker-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: -12px -14px 12px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.tracker-card--minimized .tracker-card__header {
  margin-bottom: 0;
  border-bottom: none;
}

.tracker-card__header--minimized {
  min-height: 36px;
  padding: 4px 14px;
}

.tracker-card__title {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin: 0;
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: #303133;
  overflow: hidden;
}

.tracker-card__header--minimized .tracker-card__title {
  line-height: 28px;
}

.tracker-card__title-name {
  flex-shrink: 0;
  display: inline-block;
  width: 16ch;
  white-space: pre;
  box-sizing: content-box;
}

.tracker-card__title-id {
  flex-shrink: 0;
  white-space: nowrap;
}

.tracker-card__title-id--measure {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  height: 0;
  overflow: hidden;
}

.tracker-card__header-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.tracker-card__bom-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 24px;
  padding: 0 6px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.5);
  color: #409eff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.tracker-card__bom-btn:hover {
  background: rgba(255, 255, 255, 0.85);
  color: #66b1ff;
}

.tracker-card__bom-btn--alert {
  animation: tracker-card-bom-blink 0.5s linear infinite;
}

.tracker-card__bom-btn--alert:hover {
  color: #fff;
}

@keyframes tracker-card-bom-blink {
  0%, 49.9% {
    background: rgba(245, 108, 108, 0.92);
    color: #fff;
    box-shadow: 0 0 0 1px rgba(245, 108, 108, 0.65);
  }

  50%, 100% {
    background: rgba(255, 255, 255, 0.5);
    color: #f56c6c;
    box-shadow: none;
  }
}

.tracker-card__toggle-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.5);
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.tracker-card__toggle-btn:hover {
  background: rgba(255, 255, 255, 0.85);
  color: #409eff;
}

.tracker-card__header-qty {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  height: 28px;
}

.tracker-card__header-qty-label {
  font-size: 13px;
  line-height: 28px;
  color: #606266;
}

.tracker-card__header-qty-input {
  width: 64px;
}

.tracker-card__header-qty-input ::v-deep .el-input {
  display: block;
  height: 28px;
  line-height: 28px;
}

.tracker-card__header-qty-input ::v-deep .el-input__inner {
  height: 28px;
  line-height: 28px;
  padding: 0 8px;
  font-size: 12px;
}

.tracker-card .section-block + .section-block {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

.tracker-card__body {
  position: relative;
  overflow: hidden;
}

.tracker-card__watermark-layer {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(64px, 1fr);
  align-content: space-evenly;
  padding: 16px 10px;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.tracker-card__watermark-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  max-width: 100%;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  line-height: 1.2;
  transform: rotate(-22deg);
}

.tracker-card__watermark-brand {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1.2px;
  line-height: 1;
  white-space: nowrap;
}

.tracker-card__watermark-name {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tracker-card__watermark-item:nth-child(3n + 2) {
  transform: rotate(-22deg) translateY(10px);
}

.tracker-card__watermark-item:nth-child(6n + 4),
.tracker-card__watermark-item:nth-child(6n + 5) {
  transform: rotate(-22deg) translateY(-6px);
}

.tracker-card__body > .section-block {
  position: relative;
  z-index: 1;
}

.tracker-card__pic {
  position: relative;
  z-index: 1;
  margin-bottom: 12px;
}

.section-block__title {
  margin: 0 0 8px;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: #303133;
  border-left: 3px solid #409eff;
}

.section-block__content {
  padding: 0 2px;
}

.field-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  min-height: 28px;
  padding: 5px 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.field-row--single {
  max-width: 360px;
}

.field-row__label {
  flex-shrink: 0;
  min-width: 42px;
  font-size: 13px;
  color: #606266;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 6px 10px;
}

.field-grid--tracker {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.field-grid--surface {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.field-cell__select--surface {
  flex: 1.5 1 0;
  min-width: 0;
}

.field-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.field-cell__label {
  flex-shrink: 0;
  font-size: 13px;
  color: #606266;
}

.field-cell__input {
  flex: 1;
  min-width: 0;
  max-width: 64px;
}

.field-cell__input ::v-deep .el-input__inner {
  height: 24px;
  line-height: 24px;
  padding: 0 6px;
  font-size: 13px;
}

.field-cell__select {
  flex: 1;
  min-width: 0;
}

.field-cell__select--inline {
  flex: 1;
  max-width: 200px;
}

.field-cell__select ::v-deep .el-input__inner {
  height: 24px;
  line-height: 24px;
  font-size: 13px;
}

.purlin-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.purlin-item {
  padding: 8px 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.purlin-item + .purlin-item {
  margin-top: 8px;
}

.purlin-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.purlin-item__label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.purlin-item__delete {
  padding: 0;
  color: #f56c6c;
}

.purlin-item .field-cell {
  background: transparent;
  padding: 4px 0;
}

.purlin-item .field-cell__label {
  width: 56px;
  text-align: right;
}

.field-grid--purlin {
  grid-template-columns: minmax(280px, 1.8fr) minmax(120px, 1fr) minmax(130px, 1fr) minmax(96px, 0.7fr);
  gap: 6px 12px;
  align-items: center;
}

.field-cell--purlin-section {
  gap: 8px;
}

.field-cell__select--purlin-section {
  flex: 1;
  min-width: 0;
}

.field-cell__action-btn {
  flex-shrink: 0;
  margin-left: 0;
}

.field-cell--purlin-amount .field-cell__input--purlin-amount {
  max-width: none;
  width: 100%;
}

.field-grid--purlin-install {
  margin-top: 4px;
  grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr);
  gap: 6px 12px;
  align-items: center;
}
</style>
