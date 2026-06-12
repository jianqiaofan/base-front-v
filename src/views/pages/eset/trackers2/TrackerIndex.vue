<template>
  <div class="bominput-container scrollable-div">
    <div class="file-upload-section">
      <div class="upload-panel">
        <div class="upload-panel__left">
          <div class="upload-panel__choose">
            <el-upload
              ref="upload"
              class="upload-panel__upload"
              accept="text/plain"
              multiple
              action=""
              :show-file-list="false"
              :on-change="handleSuccess"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button type="primary" class="upload-panel__btn">选择文件</el-button>
            </el-upload>
            <div class="upload-panel__info">
              <p class="upload-panel__tip">只能上传 txt 文件</p>
              <div
                v-for="(file, index) in fileList"
                :key="file.uid || file.name"
                class="upload-panel__file-item"
              >
                <span class="upload-panel__filename">{{ file.name }}</span>
                <span class="upload-panel__file-actions">
                  <el-button
                    v-if="index > 0"
                    type="text"
                    size="mini"
                    class="upload-panel__file-move"
                    @click="moveFileUp(index)"
                  >上移</el-button>
                  <el-button
                    v-if="index < fileList.length - 1"
                    type="text"
                    size="mini"
                    class="upload-panel__file-move"
                    @click="moveFileDown(index)"
                  >下移</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    class="upload-panel__file-remove"
                    @click="removeSelectedFile(file)"
                  >删除</el-button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="upload-panel__right">
          <el-button
            type="success"
            class="upload-panel__btn"
            @click="importDataFromTxt"
          >确定选择</el-button>
        </div>
      </div>
    </div>
    <div class="tracker-section">
      <div class="section-block">
        <h3 class="section-block__title">加工地</h3>
        <div class="section-block__content">
          <div class="field-rows">
            <div class="field-row">
              <span class="field-row__label">立柱：</span>
              <el-radio-group v-model="module_data.process_site.post" size="small">
                <el-radio label="国内"></el-radio>
                <el-radio label="沙特"></el-radio>
              </el-radio-group>
            </div>
            <div class="field-row">
              <span class="field-row__label">主梁：</span>
              <el-radio-group v-model="module_data.process_site.beam" size="small">
                <el-radio label="国内"></el-radio>
                <el-radio label="沙特"></el-radio>
              </el-radio-group>
            </div>
            <div class="field-row">
              <span class="field-row__label">檩条：</span>
              <el-radio-group v-model="module_data.process_site.purlin" size="small">
                <el-radio label="国内"></el-radio>
                <el-radio label="沙特"></el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="section-block">
        <h3 class="section-block__title">备品备件率(%)</h3>
        <div class="section-block__content">
          <div class="field-grid">
            <div class="field-cell">
              <span class="field-cell__label">立柱</span>
              <el-input v-model="module_data.spareParts.post" size="small" class="field-cell__input" />
            </div>
            <div class="field-cell">
              <span class="field-cell__label">主梁</span>
              <el-input v-model="module_data.spareParts.beam" size="small" class="field-cell__input" />
            </div>
            <div class="field-cell">
              <span class="field-cell__label">檩条</span>
              <el-input v-model="module_data.spareParts.purlin" size="small" class="field-cell__input" />
            </div>
            <div class="field-cell">
              <span class="field-cell__label">紧固件</span>
              <el-input v-model="module_data.spareParts.fasten" size="small" class="field-cell__input" />
            </div>
            <div class="field-cell">
              <span class="field-cell__label">标准件</span>
              <el-input v-model="module_data.spareParts.standard" size="small" class="field-cell__input" />
            </div>
            <div class="field-cell">
              <span class="field-cell__label">机械电器</span>
              <el-input v-model="module_data.spareParts.electricalMechanical" size="small" class="field-cell__input" />
            </div>
            <div class="field-cell">
              <span class="field-cell__label">其它</span>
              <el-input v-model="module_data.spareParts.other" size="small" class="field-cell__input" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tracker-section">
      <div
        v-for="tracker in module_data.trackersInfo"
        :key="tracker.id"
        class="tracker-info-item"
      >
        <TrackerInfo :tracker="tracker" />
      </div>
    </div>
    <div class="tracker-section">
      <div class="section-block">
        <h3 class="section-block__title">气象站信息</h3>
        <div class="section-block__content">
          <el-table :data="module_data.weather_station" border size="small" class="data-table">
            <el-table-column prop="id" label="序号" width="56" align="center" />
            <el-table-column prop="des" label="设备名称" width="100" />
            <el-table-column prop="specifications" label="规格或说明" min-width="160" />
            <el-table-column label="是否选配" width="150">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.is_needed" size="mini">
                  <el-radio :label="true">选配</el-radio>
                  <el-radio :label="false">不选配</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column prop="suggest_amount" label="建议数量" min-width="120" />
            <el-table-column label="数量" min-width="280">
              <template slot-scope="scope">
                <el-radio-group
                  v-model="scope.row.is_accepted"
                  size="mini"
                  :disabled="!scope.row.is_needed"
                >
                  <el-radio :label="true">接受建议</el-radio>
                  <el-radio :label="false">手工输入</el-radio>
                </el-radio-group>
                <span v-show="!scope.row.is_accepted" class="data-table__amount-input">
                  数量:
                  <el-input
                    v-model="scope.row.amount"
                    size="mini"
                    class="data-table__amount-field"
                    :disabled="!scope.row.is_needed"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="unit_price" label="单价" width="72" align="center" />
            <el-table-column prop="newest_price" label="最新价" width="72" align="center" />
          </el-table>
          <div class="data-table__footer">
            <span class="data-table__footer-text">瓦单价：{{ weatherStationTotalPerWatt }} 元/瓦</span>
            <el-button type="primary" size="mini" @click="updateWeatherStationPrice">更新材料单价</el-button>
          </div>
        </div>
      </div>
      <div class="section-block">
        <div class="section-block__note">
          <p>通信站及围网气象站选配规则</p>
          <p>1、当子阵数量不大于3个时，仅勾选围网气象站，手动输入数量，考虑3-6Mw配置一套；</p>
          <p>2、当子阵数量大于3个时，选用通信站+围网气象站方案，通信站6Mw配置一套，围网气象站30Mw配置1套；</p>
        </div>
      </div>
    </div>
    <div class="tracker-section">
      <div class="section-block">
        <h3 class="section-block__title">Summary Result</h3>
        <div class="section-block__content">
          <template v-if="newModuleData.planTrice > 0">
          <el-table
            :data="newModuleData.summaryData"
            border
            size="small"
            class="data-table"
            :row-class-name="summaryPlanRowClassName"
          >
            <el-table-column
              type="index"
              label="序号"
              width="56"
              align="center"
              header-align="center"
              :index="summaryPlanIndexMethod"
            />
            <el-table-column label="基本信息" align="center" header-align="center">
              <el-table-column
                prop="trackBrifeName"
                label="型号"
                width="160"
                show-overflow-tooltip
                header-align="center"
              />
              <el-table-column
                prop="trackerNum"
                label="数量(套)"
                width="88"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="trackerNumRatio"
                label="占比%"
                width="80"
                align="right"
                header-align="center"
                :formatter="formatNumber3"
              />
            </el-table-column>
            <el-table-column label="重量与容量" align="center" header-align="center">
              <el-table-column
                prop="trackerWeight"
                label="单套重量(kg)"
                width="110"
                align="right"
                header-align="center"
                :formatter="formatNumber3"
              />
              <el-table-column
                prop="trackerCapacity"
                label="容量(kW)"
                width="96"
                align="right"
                header-align="center"
                :formatter="formatNumber3"
              />
              <el-table-column
                prop="trackerTotalWeight"
                label="总重量(kg)"
                width="120"
                align="right"
                header-align="center"
                :formatter="formatNumber3"
              />
              <el-table-column
                prop="trackerTotalCapacity"
                label="总容量(kW)"
                width="110"
                align="right"
                header-align="center"
                :formatter="formatNumber3"
              />
            </el-table-column>
            <el-table-column label="价格（不含备品）" align="center" header-align="center">
              <el-table-column
                prop="trackerPrice"
                label="单套价格"
                width="100"
                align="right"
                header-align="center"
                :formatter="formatNumber2"
              />
              <el-table-column
                prop="trackerTotalPrice"
                label="总价格"
                width="120"
                align="right"
                header-align="center"
                :formatter="formatNumber2"
              />
              <el-table-column
                prop="pricePerWatt"
                label="瓦单价"
                width="96"
                align="right"
                header-align="center"
                :formatter="formatNumber6"
              />
            </el-table-column>
            <el-table-column label="价格（含备品备件）" align="center" header-align="center">
              <el-table-column
                prop="trackerPriceSpare"
                label="单套价格"
                width="100"
                align="right"
                header-align="center"
                :formatter="formatNumber2"
              />
              <el-table-column
                prop="trackerTotalPriceSpare"
                label="总价格"
                width="120"
                align="right"
                header-align="center"
                :formatter="formatNumber2"
              />
              <el-table-column
                prop="pricePerWattSpare"
                label="瓦单价"
                width="96"
                align="right"
                header-align="center"
                :formatter="formatNumber6"
              />
            </el-table-column>
          </el-table>
          <p class="data-table__hint">「含备品」列表示含有备品备件的数据</p>
          </template>
          <p v-else class="data-table__empty">提交计算后将在此显示方案汇总结果</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import planUtils from '@/views/pages/eset/trackers2/utils/planUtils.js'
import { Plan, Tracker } from '@/views/pages/eset/trackers2/utils/classPlan.js'
import apiTracker from '@/views/pages/eset/trackers2/utils/apiTracker2.js'
import TrackerInfo from '@/views/pages/eset/trackers2/TrackerInfo.vue'

export default {
  name: 'TrackerIndex',

  components: {
    TrackerInfo
  },

  props: {
    planCode: {
      type: String
    },
    msg: {
      type: Object
    },
    saveable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      module_data: new Plan(),
      adjustMsg: [],
      fileList: [],
      initDefault: {
        beam_brand: '宝华',
        purlin_brand: '宝华',
        post_galvanizin_thickness: '65',
        beam_galvanizin_thickness: '275',
        purlin_galvanizin_thickness: '275',
        product_system: 'single_row',
        corrosion_proofing_grade: 'C3',
        slew_drive_inch: '5寸一级减速机',
        slew_cover_if_need: false,
        power_supply: '小组件供电',
        dumper_num: '2pairs',
        spring_damper_num: '0',
        dumper_type: '450',
        pile_type: 2,
        pile_obj: { pile_type: 2 },
        pile_desc: 'PHC管桩',
        pv_capacity: 630
      }
    }
  },

  computed: {
    ...mapGetters(['name']),

    newModuleData() {
      return planUtils.planCompute(this.module_data, this.adjustMsg)
    },

    weatherStationTotalPerWatt() {
      this.setWeatherStationAmount()
      let total = 0
      this.module_data.weather_station.forEach((ws) => {
        if (ws.is_needed) {
          total += ws.amount * ws.unit_price
        }
      })
      const r = total / this.newModuleData.planCapacity
      if (Number.isNaN(r) || !Number.isFinite(r)) {
        return '计算后显示'
      }
      return r.toFixed(6)
    }
  },

  methods: {
    setWeatherStationAmount() {
      const capacitySum = (this.module_data.trackersInfo || []).reduce((acc, t) => {
        const solarNum = t.solar_num != null
          ? t.solar_num
          : (t.solar_list || []).reduce((a, b) => a + +b, 0)
        return acc + parseInt(t.pv_capacity) * parseInt(solarNum) * parseInt(t.trackerNum) / 1000
      }, 0)
      this.module_data.weather_station.forEach((item) => {
        if (!item.is_needed || !item.is_accepted) return
        if (item.m_code === 'communication-station') {
          item.amount = Math.ceil(capacitySum / 6000)
        } else if (item.m_code === 'fence-weather-station') {
          item.amount = Math.ceil(capacitySum / 30000)
        } else if (item.m_code === 'SCADA-basic-equipment') {
          item.amount = 1
        } else if (item.m_code === 'SCADA-485-communication-module') {
          item.amount = Math.ceil(capacitySum / 6000 + 2)
        } else if (item.m_code === 'SCADA-ring-network-switch') {
          item.amount = Math.ceil(capacitySum / 6000 + 2)
        }
      })
    },

    async updateWeatherStationPrice() {
      await this.fetchWeatherStationData()
      this.module_data.weather_station.forEach((item) => {
        item.unit_price = item.newest_price
      })
    },

    fetchWeatherStationData() {
      return fetch(process.env.VUE_APP_BASE_API + '/api/findWeatherStation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: this.name
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Something went wrong on server side.')
          }
          return response.json()
        })
        .then((r) => {
          const priceMap = {}
          r.data.forEach((row) => {
            priceMap[row.product_code] = row.unit_price_grade_C3
          })
          this.module_data.weather_station.forEach((item) => {
            item.newest_price = priceMap[item.m_code]
          })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },

    getAdjustPrice(planCode) {
      return fetch(process.env.VUE_APP_BASE_API + '/api/getPlanAdjustPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: JSON.stringify({ plan_code: planCode })
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Something went wrong on server side.')
          }
          return response.json()
        })
        .then((r) => {
          this.adjustMsg = r.data || []
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },

    getThisPlanDetail(planCode) {
      return fetch(process.env.VUE_APP_BASE_API + '/api/findPlanDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: planCode
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Something went wrong on server side.')
          }
          return response.json()
        })
        .then((r) => {
          if (r.data && r.data.trim().length > 10) {
            this.module_data = this.resultCoverToPlan(r.data)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },

    resultCoverToPlan(data) {
      const planObj = JSON.parse(data)
      const plan = new Plan()
      for (const [key, value] of Object.entries(planObj)) {
        if (Object.prototype.hasOwnProperty.call(plan, key)) {
          plan[key] = value
        }
      }
      for (let i = 0; i < plan.trackersInfo.length; i++) {
        const t = new Tracker()
        for (const [key, value] of Object.entries(plan.trackersInfo[i])) {
          if (Object.prototype.hasOwnProperty.call(t, key)) {
            t[key] = value
          }
        }
        plan.trackersInfo[i] = t
      }
      this.normalizePlanSections(plan)
      return plan
    },

    importDataFromTxt() {
      this.module_data.original_file_content = []
      this.module_data.trackersInfo = []
      for (let i = 0; i < this.fileList.length; i++) {
        this.handleFile(this.fileList[i])
      }
    },

    handleFile(file) {
      const fileName = file.name
      apiTracker.getTextFileContent(file).then(content => {
        this.module_data.original_file_content.push({
          fileName: fileName,
          content: apiTracker.fileDataCleaning(content)
        })
        content = content.replace('cal_option.ui_option', 'cal_option_ui_option')
        const cntObj = JSON.parse(content)
        //判断文件是新版本还是旧版本。如果新版本，则有structure_results字段，否则没有
        let isNewVersion = false
        if ('structure_results' in cntObj) {
          isNewVersion = true
        }
        let structure_results = undefined
        let trackerList = ['Exterior','Edge','Interior']  //如果是旧版本，三个位置全导入；如果是新版本，则根据structure_results字段决定导入哪些位置
        if (isNewVersion) {
          structure_results = cntObj.structure_results
          trackerList = Object.keys(structure_results.tube_ratio)
        } 

        if ('ui_model_info' in cntObj && 'model_dict' in cntObj) {
          const initInfo = this.initDefault
          const ui_model_info = cntObj.ui_model_info
          const model_dict = cntObj.model_dict

          if ('Exterior' in model_dict && trackerList.includes('Exterior')) {
            this.module_data.trackersInfo.push(
              apiTracker.trackStr2Obj(fileName, 'Exterior', ui_model_info, model_dict.Exterior, initInfo,structure_results)
            )
          }
          if ('Edge' in model_dict && trackerList.includes('Edge')) {
            this.module_data.trackersInfo.push(
              apiTracker.trackStr2Obj(fileName, 'Edge', ui_model_info, model_dict.Edge, initInfo,structure_results)
            )
          }
          if ('Interior' in model_dict && trackerList.includes('Interior')) {
            this.module_data.trackersInfo.push(
              apiTracker.trackStr2Obj(fileName, 'Interior', ui_model_info, model_dict.Interior, initInfo,structure_results)
            )
          }

          this.normalizePlanSections(this.module_data)
        } else {
          alert('文件格式错误警告：\n你输入的文件名为：' + file.name + ' 的内容无效!\n请重新选择！')
        }
      }).catch(error => {
        console.error('读取文件出错:', error)
      })
    },

    handleSuccess(file, fileList) {
      const isDuplicate = fileList.some((item) => {
        return item.uid !== file.uid && item.name === file.name
      })

      if (isDuplicate) {
        this.$message.warning(`文件「${file.name}」已存在，不能重复上传`)
        const dedupedList = fileList.filter((item) => item.uid !== file.uid)
        this.fileList = dedupedList
        if (this.$refs.upload) {
          this.$refs.upload.uploadFiles = dedupedList
        }
        return
      }

      this.fileList = fileList
    },

    handleRemove(file, fileList) {
      this.fileList = fileList
    },

    removeSelectedFile(file) {
      if (this.$refs.upload) {
        this.$refs.upload.handleRemove(file)
      }
    },

    syncUploadFileList(list) {
      this.fileList = list
      if (this.$refs.upload) {
        this.$refs.upload.uploadFiles = list
      }
    },

    moveFileUp(index) {
      if (index <= 0) {
        return
      }
      const list = this.fileList.slice()
      const current = list[index]
      list[index] = list[index - 1]
      list[index - 1] = current
      this.syncUploadFileList(list)
    },

    moveFileDown(index) {
      if (index >= this.fileList.length - 1) {
        return
      }
      const list = this.fileList.slice()
      const current = list[index]
      list[index] = list[index + 1]
      list[index + 1] = current
      this.syncUploadFileList(list)
    },

    handlePreview(file) {
      console.log('preview file:', file)
    },

    isPostOriginSectionValid(originSection) {
      if (originSection === undefined || originSection === null || String(originSection).trim() === '') {
        return false
      }
      return /\d/.test(String(originSection))
    },

    isBeamOriginSectionValid(originSection) {
      if (!originSection) return false
      return /^(.*x)(\d+(?:\.\d+)?)$/i.test(String(originSection).trim())
    },

    normalizeSectionOrigin(item, kind) {
      if (!item || !item.section) return
      const valid = kind === 'beam'
        ? this.isBeamOriginSectionValid(item.origin_section)
        : this.isPostOriginSectionValid(item.origin_section)
      if (!valid) {
        item.origin_section = item.section
      }
    },

    normalizeTrackerSections(tracker) {
      if (!tracker) return
      ;(tracker.post_info_lst || []).forEach((p) => this.normalizeSectionOrigin(p, 'post'))
      ;(tracker.beam_info_lst || []).forEach((b) => this.normalizeSectionOrigin(b, 'beam'))
    },

    normalizePlanSections(plan) {
      if (!plan || !plan.trackersInfo) return
      plan.trackersInfo.forEach((t) => this.normalizeTrackerSections(t))
    },

    summaryPlanRowClassName({ row }) {
      if (row && row.trackBrifeName === '合计') {
        return 'data-table__row-total'
      }
      return ''
    },

    summaryPlanIndexMethod(index) {
      const rows = this.newModuleData && this.newModuleData.summaryData
      if (rows && rows[index] && rows[index].trackBrifeName === '合计') {
        return '—'
      }
      return index + 1
    },

    formatNumber(cellValue, decimals) {
      if (typeof cellValue !== 'number') return cellValue
      if (cellValue === 0) return ''
      if (Number.isInteger(cellValue)) return cellValue
      return cellValue.toFixed(decimals)
    },

    formatNumber2(row, column, cellValue) {
      return this.formatNumber(cellValue, 2)
    },

    formatNumber3(row, column, cellValue) {
      return this.formatNumber(cellValue, 3)
    },

    formatNumber6(row, column, cellValue) {
      return this.formatNumber(cellValue, 6)
    }
  },

  created() {
    let planCode
    if (this.planCode !== undefined) {
      planCode = this.planCode
      this.getThisPlanDetail(planCode)
    } else if (this.msg && this.msg.planCode) {
      planCode = this.msg.planCode
      this.getThisPlanDetail(planCode)
    } else {
      planCode = String(Date.now())
    }
    this.getAdjustPrice(planCode)
  }
}
</script>

<style scoped>
.bominput-container {
  position: relative;
  text-align: left;
  max-width: 100%; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
  overflow-y: scroll;
}

.scrollable-div {
  height: 1260px;
  padding-left: 20px;
  padding-bottom: 600px;
  overflow-y: scroll;
}
/* 外层分区容器：后续每个 tracker-section 复用 */
.tracker-section {
  position: relative;
  width: 100%;
  max-width: 1200px;
  min-height: 200px;
  margin-bottom: 16px;
  padding: 22px 24px 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 6px 20px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.tracker-section:hover {
  border-color: #d0d7e2;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.05),
    0 10px 28px rgba(0, 0, 0, 0.08);
}

/* 顶部色条标识 */
.tracker-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 50%, #409eff 100%);
  pointer-events: none;
}

.tracker-section > * {
  position: relative;
  z-index: 1;
}

.file-upload-section {
  position: relative;
  width: 100%;
  max-width: 1200px;
  min-height: 100px;
  margin-bottom: 16px;
  padding: 22px 24px 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 6px 20px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
  box-sizing: border-box;
}

.file-upload-section:hover {
  border-color: #d0d7e2;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.05),
    0 10px 28px rgba(0, 0, 0, 0.08);
}

.file-upload-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 50%, #409eff 100%);
  pointer-events: none;
}

.file-upload-section > * {
  position: relative;
  z-index: 1;
}

.upload-panel {
  display: flex;
  align-items: center;
  min-height: 80px;
  gap: 12px;
}

.upload-panel__left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.upload-panel__right {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.upload-panel__choose {
  display: flex;
  align-items: center;
  width: 100%;
}

.upload-panel__upload {
  flex-shrink: 0;
}

.upload-panel__upload ::v-deep .el-upload {
  display: block;
}

.upload-panel__btn {
  width: 120px;
  height: 80px;
  padding: 0 8px;
  font-size: 14px;
  line-height: 1.4;
  white-space: normal;
}

.upload-panel__info {
  flex: 1;
  min-width: 0;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.upload-panel__tip {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.upload-panel__filename {
  font-size: 13px;
  color: #303133;
  line-height: 1.5;
  word-break: break-all;
}

.upload-panel__file-item {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 4px;
  max-width: 100%;
}

.upload-panel__file-actions {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}

.upload-panel__file-move,
.upload-panel__file-remove {
  flex-shrink: 0;
  margin: 0;
  padding: 0 2px;
  height: auto;
  line-height: 1.5;
}

.upload-panel__file-move {
  color: #409eff;
}

.upload-panel__file-move ::v-deep span,
.upload-panel__file-remove ::v-deep span {
  line-height: 1.5;
}

.upload-panel__file-item:hover .upload-panel__file-actions {
  opacity: 1;
  visibility: visible;
}

.upload-panel__file-move:hover {
  color: #66b1ff;
}

.upload-panel__file-remove {
  color: #f56c6c;
}

.upload-panel__file-remove:hover {
  color: #f78989;
}

.tracker-info-item + .tracker-info-item {
  margin-top: 12px;
}

/* 内部分区块：可堆叠多个 */
.section-block + .section-block {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
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

/* 行式字段（适合单选、下拉等横向条目） */
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

/* 多行并排容器 */
.field-rows {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px 10px;
}

.field-rows .field-row + .field-row {
  margin-top: 0;
}

.field-row__label {
  flex-shrink: 0;
  min-width: 42px;
  font-size: 13px;
  color: #606266;
}

/* 网格式字段（适合多输入项紧凑排列） */
.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 6px 10px;
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

/* 数据表格 */
.data-table {
  width: 100%;
}

.data-table ::v-deep .el-table th {
  padding: 6px 0;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  background: #f5f7fa;
}

.data-table ::v-deep .el-table td {
  padding: 6px 0;
  font-size: 13px;
  color: #606266;
  font-variant-numeric: tabular-nums;
}

.data-table ::v-deep .el-radio {
  margin-right: 8px;
}

.data-table ::v-deep .el-radio__label {
  font-size: 12px;
  padding-left: 4px;
}

.data-table__amount-input {
  margin-left: 12px;
  font-size: 12px;
  color: #606266;
}

.data-table__amount-field {
  width: 56px;
  margin-left: 4px;
}

.data-table__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  padding: 8px 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.data-table__footer-text {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.data-table ::v-deep tr.data-table__row-total > td {
  font-weight: 700;
  border-top: 2px solid #dcdfe6;
}

.data-table__hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #909399;
}

.data-table__empty {
  margin: 0;
  padding: 24px 16px;
  font-size: 13px;
  color: #909399;
  text-align: center;
  background: #f5f7fa;
  border-radius: 4px;
}

.section-block__note {
  font-size: 12px;
  line-height: 1.7;
  color: #f56c6c;
}

.section-block__note p {
  margin: 0 0 4px;
}

.section-block__note p:first-child {
  font-weight: 600;
}

@media (max-width: 640px) {
  .file-upload-section,
  .tracker-section {
    padding: 18px 16px 16px;
    border-radius: 10px;
  }

  .file-upload-section::before,
  .tracker-section::before {
    left: 12px;
    right: 12px;
  }

  .upload-panel {
    flex-direction: column;
    align-items: stretch;
    min-height: auto;
  }

  .upload-panel__right {
    width: 100%;
  }

  .field-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .field-rows {
    grid-template-columns: 1fr;
  }

  .data-table__footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
