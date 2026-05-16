<template>
  <div class="bom-list-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="材料清单(中文)" name="first">
        <div class="tab-pane-toolbar">
          <el-button
            class="eco-export-btn"
            size="small"
            icon="el-icon-download"
            :loading="pdfLoading"
            @click="printPane('zh')"
          >
            导出 PDF
          </el-button>
        </div>
        <div id="print-area-zh" class="printable-area">
          <h2 class="sheet-title">材料清单(中文)</h2>
          <el-table
            :data="bomList_zh"
            border
            :highlight-current-row="true"
            height="900px"
          >
            <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="name" label="材料名称" width="250"></el-table-column>
            <el-table-column
              prop="specification"
              label="规格"
              width="300"
              :formatter="formatSpecification"
            ></el-table-column>
            <el-table-column prop="material" label="材质" width="200"></el-table-column>
            <el-table-column prop="lenth" label="长度" width="100" :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="unit" label="单位" width="60"></el-table-column>
            <el-table-column prop="totalAmount" label="数量" width="90"></el-table-column>
            <el-table-column prop="surfaceTreatment" label="表面处理" width="250"></el-table-column>
          </el-table>
        </div>
        <div style="height: 600px"></div>
      </el-tab-pane>
      <el-tab-pane label="Material List(English)" name="second">
        <div class="tab-pane-toolbar">
          <el-button
            class="eco-export-btn"
            size="small"
            icon="el-icon-download"
            :loading="pdfLoading"
            @click="printPane('en')"
          >
            Export PDF
          </el-button>
        </div>
        <div id="print-area-en" class="printable-area">
          <h2 class="sheet-title">Material List (English)</h2>
          <el-table
            :data="bomList_en"
            border
            :highlight-current-row="true"
            height="900px"
          >
            <el-table-column type="index" label="No." width="50" :index="indexMethod"></el-table-column>
            <el-table-column prop="name" label="Material" width="250" :formatter="formatTranslateName2En"></el-table-column>
            <el-table-column
              prop="specification"
              label="Specification"
              width="300"
              :formatter="formatTranslateSpecification2En"
            ></el-table-column>
            <el-table-column prop="material" label="Material type" width="200" :formatter="formatTranslateMaterial2En"></el-table-column>
            <el-table-column prop="lenth" label="Length" width="100" :formatter="formatNumber2"></el-table-column>
            <el-table-column prop="unit" label="Unit" width="60" :formatter="formatTranslateUnit2En"></el-table-column>
            <el-table-column prop="totalAmount" label="Qty" width="90"></el-table-column>
            <el-table-column
              prop="surfaceTreatment"
              label="Surface Treatment"
              width="250"
              :formatter="formatTranslateSurfaceTreatment2En"
            ></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { exportBomPdfFromCanvas } from '@/views/pages/eset/trackers2/utils/bomPrintCanvas'

/** 与 el-table 列宽比例一致：50+250+300+200+100+60+90+250 */
const COL_WIDTH_WEIGHTS = [50, 250, 300, 200, 100, 60, 90, 250]

export default {
  name: 'PlanBomListZh',
  data() {
    return {
      activeName: 'first',
      pdfLoading: false,
      bomList_zh: [],
      bomList_en: []
    }
  },
  props: {
    planResult: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    // 自定义排序规则
    const priceOrder = ['04', '05', '06', '07', '08', '09', '01', '02', '03'];
    if (Array.isArray(this.planResult.priceMsg)) {
      this.planResult.priceMsg.sort((a, b) => {
        const getPrefix = (item) => typeof item.priceId === 'string' ? item.priceId.substring(0, 2) : '';
        const aPrefix = getPrefix(a);
        const bPrefix = getPrefix(b);
        const getOrder = (prefix) => {
          const idx = priceOrder.indexOf(prefix);
          return idx !== -1 ? idx : priceOrder.length;
        };
        return getOrder(aPrefix) - getOrder(bPrefix);
      });
    }
    console.log("planResult.priceMsg:",this.planResult.priceMsg)
    this.bomList_zh = JSON.parse(JSON.stringify(this.planResult.priceMsg))
    this.bomList_en = this.translateZh2En(this.planResult.priceMsg)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    buildZhRows() {
      const list = Array.isArray(this.planResult.priceMsg) ? this.planResult.priceMsg : []
      return list.map((row, index) => [
        String(index + 1),
        row.name != null ? String(row.name) : '',
        this.formatSpecification(row, {}, row.specification),
        row.material != null ? String(row.material) : '',
        this.formatNumber2(row, {}, row.lenth),
        row.unit != null ? String(row.unit) : '',
        row.totalAmount != null ? String(row.totalAmount) : '',
        row.surfaceTreatment != null ? String(row.surfaceTreatment) : ''
      ])
    },
    buildEnRows() {
      const list = Array.isArray(this.planResult.priceMsg) ? this.planResult.priceMsg : []
      return list.map((row, index) => [
        String(index + 1),
        row.name != null ? String(row.name) : '',
        this.formatTranslateSpecification2En(row, {}, row.specification),
        row.material != null ? String(row.material) : '',
        this.formatNumber2(row, {}, row.lenth),
        this.formatTranslateUnit2En(row, {}, row.unit),
        row.totalAmount != null ? String(row.totalAmount) : '',
        this.formatTranslateSurfaceTreatment2En(row, {}, row.surfaceTreatment)
      ])
    },
    async printPane(target) {
      const zhColumns = ['序号', '材料名称', '规格', '材质', '长度', '单位', '数量', '表面处理']
      const enColumns = ['No.', 'Material', 'Specification', 'Material type', 'Length', 'Unit', 'Qty', 'Surface Treatment']

      this.pdfLoading = true
      try {
        await this.$nextTick()
        if (target === 'zh') {
          exportBomPdfFromCanvas({
            fileName: '材料清单.pdf',
            title: '材料清单（中文）',
            columnTitles: zhColumns,
            colFractions: COL_WIDTH_WEIGHTS,
            rows: this.buildZhRows(),
            englishFont: false
          })
        } else {
          exportBomPdfFromCanvas({
            fileName: 'Material_List.pdf',
            title: 'Material List (English)',
            columnTitles: enColumns,
            colFractions: COL_WIDTH_WEIGHTS,
            rows: this.buildEnRows(),
            englishFont: true
          })
        }
        this.$message.success(target === 'zh' ? '已开始下载 PDF' : 'PDF download started')
      } catch (e) {
        console.error(e)
        this.$message.error('导出失败')
      } finally {
        this.pdfLoading = false
      }
    },
    indexMethod(index) {
      return index + 1
    },
    formatNumber2(row, column, cellValue) {
      if (typeof (cellValue) === 'number') {
        if (cellValue === 0) {
          return ''
        }
        if (Number.isInteger(cellValue)) {
          return String(cellValue)
        }
        return cellValue.toFixed(2)
      }
      return cellValue != null ? String(cellValue) : ''
    },
    formatSpecification(row, column, cellValue) {
      if (row.priceId && ['04', '05', '06'].includes(row.priceId.substring(0, 2))) {
        return ''
      }
      return cellValue != null ? String(cellValue) : ''
    },

    //翻译中文为英文
    translateZh2En(bomList_zh) {
      
    },


    formatTranslateUnit2En(row, column, cellValue) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return String(cellValue)
        .replace('件', 'pic')
        .replace('根', 'pic')
        .replace('套', 'set')
    },
    formatTranslateName2En(row, column, cellValue) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return String(cellValue)
        .replace('非驱动立柱 ', '')
        .replace('驱动立柱 ', '')
        .replace('寸减速机', '-inch drive motor')
        .replace('寸一级减速机', '-inch drive motor class1')
        .replace('寸二级减速机', '-inch drive motor class2')
        .replace('主从通信电缆', 'Master-slave communication cable')
        .replace('组串供电-主控制箱', 'String power supply-main control box')
        .replace('组串供电-从控制箱', 'String power supply-slave control box')
        .replace('电控箱喉箍', 'Control box throat clamp')
        .replace('平方支架接地线', 'mm Grounding wire')
        .replace('支架接地线', 'Grounding wire')
        .replace('八角形主梁抱箍', 'Octagonal main beam clamp')
        .replace('阻尼支臂', 'Damping support arm')
        .replace('阻尼器', 'Damping device')
        .replace('檩条', 'Prulin ')
        .replace('小组件光伏板', 'Small component solar panel')
        .replace('无线接收器支架', 'Wireless receiver bracket')
        .replace('小组件供电-主控制箱(6节电池)', 'Small component power supply-main control box(6 batteries)')
        .replace('小组件供电-主控制箱(8节电池)', 'Small component power supply-main control box(8 batteries)')

        .replace('马车螺栓', 'Cartridge bolt')
        .replace('螺带插销钉', 'Cartridge bolt')
        .replace('螺栓带插销钉', 'Cartridge bolt')
        .replace('六角开槽螺母', 'Hexagon slot nut')
        .replace('六角螺母', 'Hexagon nut')
        .replace('法兰螺母', 'Flange nut')
        .replace('螺栓', 'Bolt')
        .replace('双叠自锁垫片', 'Double-layer self-locking gasket')
        .replace('大垫片(非标)', 'Large gasket (non-standard) ')
        .replace('大垫片', 'Large gasket ')
        .replace('平垫片', 'Flat gasket ')
        .replace('标准型弹簧垫圈', 'Standard spring washer')
        .replace('弹簧垫圈', 'Spring washer')
        .replace('抗剪导向垫片-L型', 'Shear-resistant guide gasket-L type ')
        .replace('下固定件-轻型', 'Light type lower fixing ')
        .replace('下固定件-重型', 'Heavy type lower fixing ')

        .replace('主梁封盖', 'Main beam cover')
        .replace('轴承座下', 'Bearings on the bottom')
        .replace('轴承座上', 'Bearings on the top')
        .replace('长垫块', 'Long gasket block ')
        .replace('短垫块', 'Short gasket block ')


        .replace('矩形', 'Gasket')
        .replace('八角型', 'Octagonal ')
        .replace('垫片', 'Gasket ')
        .replace('垫块', 'Gasket block ')
        .replace('底座', 'Base ')
        .replace('套管', 'Tube ')
        .replace('牛腿', 'supporting part')
        .replace('不锈钢', 'Stainless steel ')
        .replace('定位片', 'Positioning plate ')

    },
    formatTranslateSpecification2En(row, column, cellValue) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return String(cellValue)
        .replace('双叠自锁垫片', 'double-layer self-locking gasket')
        .replace('两端带配M10螺栓孔径线鼻子', 'M10 bolt hole diameter line nose at both ends')
        .replace('减速机底座与立柱连接', 'Drive motor base and column connection')
        .replace('减速机底座与减速机连接', 'Drive motor base and drive motor connection')
        .replace('牛腿与立柱连接', 'Leg and column connection')
        .replace('主梁抱箍连接', 'Main beam clamp connection')
        .replace('阻尼器下固定件与立柱连接', 'Damping device lower fixing and column connection')
        .replace('阻尼器固定螺栓', 'Damping device fixed bolt')
        .replace('缩径主轴连接', 'Reduced diameter main shaft connection ')
        .replace('无线接收器支架固定', 'Wireless receiver bracket fixed')
        .replace('螺栓', ' bolt')
        .replace('螺母', ' nut')
        .replace('带屏蔽', 'shielded')
    },
    formatTranslateSurfaceTreatment2En(row, column, cellValue) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return String(cellValue)
        .replace('锌铝镁镀层', 'Zinc aluminum magnesium coating')
        .replace('锌铝镁', 'Zinc aluminum magnesium')
        .replace('热镀锌平均', 'Average hot-dip galvanizing')
        .replace('热镀锌', 'hot-dip galvanizing')
        .replace('平均厚度', 'average thickness ')
        .replace('双面', 'double surface')
    },
    formatTranslateMaterial2En(row, column, cellValue) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return String(cellValue)
        .replace('6.8级', '6.8 grade')
        .replace('8.8级', '8.8 grade')

    }
  }
}
</script>

<style scoped>
.bom-list-container {
  padding: 18px 20px 24px;
  border-radius: 14px;
  background: linear-gradient(155deg, #f8fffc 0%, #ecfdf5 38%, #f0fdf4 72%, #ecfeff 100%);
  box-shadow:
    0 0 0 1px rgba(45, 212, 191, 0.25),
    0 8px 32px rgba(6, 95, 70, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.tab-pane-toolbar {
  margin-bottom: 16px;
}

.eco-export-btn {
  border: none !important;
  color: #ecfdf5 !important;
  background: linear-gradient(135deg, #059669 0%, #047857 45%, #0d9488 100%) !important;
  box-shadow:
    0 2px 8px rgba(5, 150, 105, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  letter-spacing: 0.03em;
}

.eco-export-btn:hover,
.eco-export-btn:focus {
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #14b8a6 100%) !important;
  color: #fff !important;
}

.sheet-title {
  position: relative;
  font-size: 19px;
  font-weight: 700;
  margin: 0 0 18px;
  letter-spacing: 0.06em;
  padding-bottom: 12px;
  background: linear-gradient(90deg, #047857 0%, #059669 35%, #0d9488 70%, #14b8a6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sheet-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 56px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #34d399, #22d3ee);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.45);
}

/* Element UI：绿色环保 + 科技感 */
.bom-list-container >>> .el-tabs__header {
  margin-bottom: 18px;
}

.bom-list-container >>> .el-tabs__nav-wrap::after {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.45), transparent);
}

.bom-list-container >>> .el-tabs__item {
  color: #64748b;
  font-weight: 500;
}

.bom-list-container >>> .el-tabs__item.is-active {
  color: #047857;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(52, 211, 153, 0.25);
}

.bom-list-container >>> .el-tabs__active-bar {
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #10b981, #22d3ee, #14b8a6);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.45);
}

.bom-list-container >>> .el-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(52, 211, 153, 0.35) !important;
  box-shadow: 0 2px 16px rgba(6, 95, 70, 0.06);
}

.bom-list-container >>> .el-table th.el-table__cell {
  background: linear-gradient(180deg, #10b981 0%, #059669 42%, #047857 100%) !important;
  color: #ecfdf5 !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em;
  border-color: rgba(167, 243, 208, 0.35) !important;
}

.bom-list-container >>> .el-table td.el-table__cell {
  border-color: rgba(52, 211, 153, 0.28) !important;
  color: #064e3b;
}

.bom-list-container >>> .el-table__body tr:nth-child(even) td.el-table__cell {
  background: #f0fdf4 !important;
}

.bom-list-container >>> .el-table__body tr:nth-child(odd) td.el-table__cell {
  background: #ffffff !important;
}

.bom-list-container >>> .el-table__body tr:hover > td.el-table__cell {
  background: rgba(236, 253, 245, 0.95) !important;
}

.bom-list-container >>> .el-table::before {
  display: none;
}
</style>
