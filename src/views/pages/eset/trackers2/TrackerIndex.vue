<template>
  <div class="bominput-container scrollable-div">
    <div class="tracker-scroll-top-bar">
      <div v-if="hasModuleData" class="tracker-scroll-top-bar__nav">
        <el-button
          type="text"
          size="mini"
          class="tracker-scroll-top-bar__btn"
          @click="scrollToSection('trackersInputSection')"
        >
          查看支架
        </el-button>
        <el-button
          type="text"
          size="mini"
          class="tracker-scroll-top-bar__btn"
          @click="scrollToSection('weatherStationSection')"
        >
          气象站
        </el-button>
        <el-button
          type="text"
          size="mini"
          class="tracker-scroll-top-bar__btn"
          @click="scrollToSection('summaryQuoteSection')"
        >
          综合报价
        </el-button>
        <el-button
          type="text"
          size="mini"
          class="tracker-scroll-top-bar__btn"
          @click="scrollToSection('priceTableSection')"
        >
          产品价格表
        </el-button>
      </div>
      <span v-else class="tracker-scroll-top-bar__placeholder"></span>
      <div class="tracker-scroll-top-bar__actions">
        <el-button
          type="text"
          size="mini"
          class="tracker-scroll-top-bar__btn"
          @click="scrollToTop"
        >
          回到顶部
        </el-button>
        <el-button
          type="text"
          size="mini"
          class="tracker-scroll-top-bar__btn"
          @click="scrollToBottom"
        >
          回到底部
        </el-button>
      </div>
    </div>
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
              :disabled="!fileImportEnabled"
              :on-change="handleSuccess"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button
                type="primary"
                class="upload-panel__btn"
                :disabled="!fileImportEnabled"
              >选择文件</el-button>
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
            :disabled="!fileImportEnabled"
            @click="importDataFromTxt"
          >确定选择</el-button>
          <el-button
            type="warning"
            class="upload-panel__btn"
            @click="saveOrUpdatePlan"
          >保存</el-button>
          <el-button
            type="success"
            class="upload-panel__btn"
            :loading="calculationSubmitting"
            :disabled="calculationSubmitting"
            @click="submitCalculation"
          >提交计算</el-button>
        </div>
      </div>
    </div>
    <template v-if="hasModuleData">
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
    <div ref="trackersInputSection" class="tracker-section">
      <div class="tracker-highlight-bar">
        <div class="tracker-highlight-bar__stat">
          <span class="tracker-highlight-bar__stat-label">支架总套数</span>
          <span class="tracker-highlight-bar__stat-value">{{ highlightTotalTrackerNum }}</span>
        </div>
        <div class="tracker-highlight-bar__stat">
          <span class="tracker-highlight-bar__stat-label">总容量(kW)</span>
          <span class="tracker-highlight-bar__stat-value">{{ highlightTotalCapacityText }}</span>
        </div>
        <div
          v-if="hasCalculationBomError"
          class="tracker-highlight-bar__alert"
        >
          计算有异常，请打开BOM表查看详情！
        </div>
        <div class="tracker-highlight-bar__actions">
          <!-- <el-button
            type="text"
            size="mini"
            class="tracker-highlight-bar__action-btn"
            @click="openQuickInputDialog"
          >
            快速输入
          </el-button> -->
          <el-button
            type="text"
            size="mini"
            class="tracker-highlight-bar__action-btn"
            @click="toggleAllTrackersMinimize"
          >
            {{ allTrackersCollapsed ? '展开支架' : '折叠支架' }}
          </el-button>
        </div>
      </div>
      <div
        v-for="tracker in module_data.trackersInfo"
        :key="tracker.id"
        class="tracker-info-item"
      >
        <TrackerInfo :tracker="tracker" @open-bom="getDrawerTracker" />
      </div>
    </div>
    <div ref="weatherStationSection" class="tracker-section">
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
    <div ref="summaryQuoteSection" class="tracker-section">
      <div class="section-block">
        <h3 class="section-block__title">综合报价</h3>
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
    <div ref="priceTableSection" class="tracker-section">
      <div class="section-block">
        <h3 class="section-block__title">产品价格表</h3>
        <div class="section-block__content">
          <div v-if="hasPriceTableData" class="summary-price">
            <el-table
              :data="newModuleData.priceMsg"
              border
              highlight-current-row
              height="520"
              size="small"
              class="summary-price__table data-table"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
                :index="priceTableIndexMethod"
              />
              <el-table-column prop="productCategory" label="材料类别" width="150" show-overflow-tooltip />
              <el-table-column prop="name" label="材料名称" width="200" show-overflow-tooltip />
              <el-table-column label="成本明细" width="80" align="center">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <div class="summary-price__popover">
                      <template v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.adjustMsg !== undefined">
                        <div
                          v-for="ad in scope.row.priceDetailObj.adjustMsg"
                          :key="ad.id"
                          class="summary-price__adjust-item"
                        >
                          <p>调后价: {{ ad.new_price }}</p>
                          <p>调价人: {{ ad.price_adjuster }}</p>
                          <p>调价原因: {{ ad.reason }}</p>
                          <p>调价日期: {{ ad.create_time_local }}</p>
                        </div>
                      </template>
                      <p>材料名称: {{ scope.row.name }}</p>
                      <p>
                        成本价:
                        <span class="summary-price__cost">{{ scope.row.costPrice }}</span>
                        <span v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.adjustMsg !== undefined">
                          原始价: {{ scope.row.systemPrice }}
                        </span>
                      </p>
                      <p v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.rawFee > 0">
                        原材料价: {{ scope.row.priceDetailObj.rawFee }}
                      </p>
                      <p v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.utilizationRate < 1">
                        利用率: {{ scope.row.priceDetailObj.utilizationRate }}
                      </p>
                      <p v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.surfaceFee > 0">
                        表面处理费: {{ scope.row.priceDetailObj.surfaceFee }}
                      </p>
                      <p v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.processingFee > 0">
                        加工费: {{ scope.row.priceDetailObj.processingFee }}
                      </p>
                      <p v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.packagingFee > 0">
                        包装费: {{ scope.row.priceDetailObj.packagingFee }}
                      </p>
                    </div>
                    <div slot="reference" class="summary-price__cost-tag">
                      <el-tag size="medium">
                        {{ scope.row.costPrice }}
                        <span
                          v-if="scope.row.priceDetailObj && scope.row.priceDetailObj.adjustMsg !== undefined"
                          class="summary-price__cost-mark"
                        >*</span>
                      </el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="调价" width="72" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" @click="priceTableHandleEdit(scope.row)">调价</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="priceMethod" label="计价方式" width="80" />
              <el-table-column prop="unit" label="单位" width="50" align="center" />
              <el-table-column
                prop="unitPrice"
                label="单价"
                width="70"
                align="right"
                header-align="center"
                :formatter="formatNumber2"
              />
              <el-table-column prop="totalAmount" label="数量" width="90" align="right" header-align="center" />
              <el-table-column
                prop="totalPrice"
                label="总价"
                width="100"
                align="right"
                header-align="center"
                :formatter="formatNumber2"
              />
              <el-table-column prop="specification" label="规格" width="220" show-overflow-tooltip />
              <el-table-column prop="material" label="材质" width="200" show-overflow-tooltip />
              <el-table-column prop="surfaceTreatment" label="表面处理" width="200" show-overflow-tooltip />
              <el-table-column prop="productCode" label="材料编号" width="200" show-overflow-tooltip />
              <el-table-column prop="processSite" label="生产地" width="80" align="center" />
              <el-table-column
                prop="weightPerMater"
                label="米重"
                width="80"
                align="right"
                header-align="center"
                :formatter="formatNumber3"
              />
            </el-table>
          </div>
          <p v-else class="data-table__empty">提交计算后将在此显示产品价格明细</p>
        </div>
      </div>
    </div>
    </template>

    <el-dialog
      title="快速输入"
      :visible.sync="quickInputDialogVisible"
      width="760px"
      append-to-body
      :close-on-click-modal="false"
      custom-class="tracker-quick-input-dialog"
    >
      <div
        v-for="item in quickInputFieldConfigs"
        :key="item.field"
        class="tracker-quick-input-row"
      >
        <span class="tracker-quick-input-row__label">{{ item.label }}</span>
        <el-select
          v-if="item.inputType === 'select'"
          v-model="quickInputValues[item.field]"
          size="small"
          class="tracker-quick-input-row__value"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="opt in quickInputSelectOptions[item.optionKey]"
            :key="String(opt.value)"
            :label="opt.text"
            :value="opt.value"
          />
        </el-select>
        <el-input
          v-else
          v-model="quickInputValues[item.field]"
          size="small"
          class="tracker-quick-input-row__value"
          placeholder="请输入"
          clearable
        />
        <el-button
          type="primary"
          size="small"
          class="tracker-quick-input-row__apply"
          @click="applyQuickInputAll(item)"
        >
          应用全部
        </el-button>
        <el-button
          size="small"
          class="tracker-quick-input-row__secondary"
          @click="openQuickInputSecondary(item)"
        >
          二次输入
        </el-button>
      </div>
      <div class="tracker-quick-input-dialog__footer">
        <el-button size="small" @click="openQuickInputReviewDialog">检查全部</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="检查全部"
      :visible.sync="quickInputReviewDialogVisible"
      width="520px"
      append-to-body
      custom-class="tracker-quick-input-review-dialog"
      @opened="handleQuickInputReviewDialogOpened"
      @closed="handleQuickInputReviewDialogClosed"
    >
      <div class="tracker-quick-input-review__field-title">
        {{ quickInputReviewFieldLabel }}
      </div>
      <el-table
        :data="quickInputReviewRows"
        border
        size="small"
        class="tracker-quick-input-check-table"
      >
        <el-table-column prop="trackBrifeName" label="支架简称" min-width="180" show-overflow-tooltip />
        <el-table-column label="当前输入" min-width="200">
          <template slot-scope="scope">
            <el-input
              v-if="quickInputReviewInputType === 'input'"
              v-model="scope.row.fieldValue"
              size="mini"
              class="tracker-quick-input-check-table__editor"
              @change="applyQuickInputReviewRowValue(scope.row)"
            />
            <el-select
              v-else
              v-model="scope.row.fieldValue"
              size="mini"
              class="tracker-quick-input-check-table__editor"
              @change="applyQuickInputReviewRowValue(scope.row)"
            >
              <el-option
                v-for="opt in quickInputSelectOptions[quickInputReviewOptionKey]"
                :key="String(opt.value)"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="tracker-quick-input-review__footer">
        <span class="tracker-quick-input-review__progress">
          {{ quickInputReviewFieldIndex + 1 }} / {{ quickInputFieldConfigs.length }}
        </span>
        <el-button size="small" @click="showQuickInputReviewPrev">查看上一个</el-button>
        <el-button size="small" @click="showQuickInputReviewNext">查看下一个</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="quickInputCheckTitle"
      :visible.sync="quickInputCheckDialogVisible"
      width="520px"
      append-to-body
      custom-class="tracker-quick-input-check-dialog"
    >
      <el-table
        :data="quickInputCheckRows"
        border
        size="small"
        class="tracker-quick-input-check-table"
      >
        <el-table-column prop="trackBrifeName" label="支架简称" min-width="180" show-overflow-tooltip />
        <el-table-column label="当前输入" min-width="200">
          <template slot-scope="scope">
            <el-input
              v-if="quickInputCheckInputType === 'input'"
              v-model="scope.row.fieldValue"
              size="mini"
              class="tracker-quick-input-check-table__editor"
              @change="applyQuickInputSecondaryRowValue(scope.row)"
            />
            <el-select
              v-else
              v-model="scope.row.fieldValue"
              size="mini"
              class="tracker-quick-input-check-table__editor"
              @change="applyQuickInputSecondaryRowValue(scope.row)"
            >
              <el-option
                v-for="opt in quickInputSelectOptions[quickInputCheckOptionKey]"
                :key="String(opt.value)"
                :label="opt.text"
                :value="opt.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="调价信息"
      :visible.sync="dialogVisiblePriceAdjust"
      width="420px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="priceAdjustForm" :model="newPriceObj" :rules="priceAdjustRules" label-width="100px" size="small">
        <el-form-item label="材料名称">{{ thePriceAdjust.name }}</el-form-item>
        <el-form-item label="计价方式">{{ thePriceAdjust.priceMethod }}</el-form-item>
        <el-form-item label="当前价格">
          <span class="summary-price__cost">{{ thePriceAdjust.costPrice }}</span>
        </el-form-item>
        <el-form-item label="新价格" prop="new_price">
          <el-input v-model="newPriceObj.new_price" />
        </el-form-item>
        <el-form-item label="调价原因" prop="reason">
          <el-input v-model="newPriceObj.reason" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisiblePriceAdjust = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveAdjustPrice">确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      size="88%"
      :before-close="handleDrawerClose"
      :with-header="true"
      append-to-body
      destroy-on-close
    >
      <TrackerResult :tracker-obj="drawerTracker" />
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import planUtils from '@/views/pages/eset/trackers2/utils/planUtils.js'
import { Plan, Tracker } from '@/views/pages/eset/trackers2/utils/classPlan.js'
import apiTracker from '@/views/pages/eset/trackers2/utils/apiTracker2.js'
import TrackerInfo from '@/views/pages/eset/trackers2/TrackerInfo.vue'
import TrackerResult from '@/views/pages/eset/trackers2/TrackerResult.vue'
import {
  QUICK_INPUT_FIELD_CONFIGS,
  QUICK_INPUT_SELECT_OPTIONS
} from '@/views/pages/eset/trackers2/utils/quickInputConfig.js'
import {
  bindDialogDrag,
  findDialogByClass,
  resetDialogPosition
} from '@/views/pages/eset/trackers2/utils/dialogDrag.js'

const CALCULATION_BASE_TIMEOUT_SEC = 30
const CALCULATION_TIMEOUT_TRACKER_THRESHOLD = 6
const CALCULATION_EXTRA_TIMEOUT_PER_TRACKER_SEC = 10

function resolveCalculationTimeoutSeconds(trackerCount) {
  const count = Math.max(0, Number(trackerCount) || 0)
  if (count <= CALCULATION_TIMEOUT_TRACKER_THRESHOLD) {
    return CALCULATION_BASE_TIMEOUT_SEC
  }
  return CALCULATION_BASE_TIMEOUT_SEC +
    (count - CALCULATION_TIMEOUT_TRACKER_THRESHOLD) * CALCULATION_EXTRA_TIMEOUT_PER_TRACKER_SEC
}

export default {
  name: 'TrackerIndex',

  components: {
    TrackerInfo,
    TrackerResult
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
      thePlanCode: '',
      module_data: new Plan(),
      adjustMsg: [],
      fileList: [],
      fileImportEnabled: true,
      fileImportStateInitialized: false,
      calculationSubmitting: false,
      drawer: false,
      drawerTitle: '无计算结果，请先计算',
      drawerTracker: {},
      dialogVisiblePriceAdjust: false,
      thePriceAdjust: {},
      newPriceObj: {
        plan_code: '',
        price_id: '',
        new_price: '',
        reason: '',
        price_adjuster: ''
      },
      priceAdjustRules: {},
      quickInputDialogVisible: false,
      quickInputValues: {},
      quickInputCheckDialogVisible: false,
      quickInputCheckTitle: '',
      quickInputCheckFieldName: '',
      quickInputCheckOptionKey: '',
      quickInputCheckInputType: 'select',
      quickInputCheckRows: [],
      quickInputReviewDialogVisible: false,
      quickInputReviewFieldIndex: 0,
      quickInputReviewFieldName: '',
      quickInputReviewOptionKey: '',
      quickInputReviewInputType: 'select',
      quickInputReviewRows: [],
      unbindQuickInputReviewDialogDrag: null,
      quickInputSelectOptions: QUICK_INPUT_SELECT_OPTIONS,
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

    hasModuleData() {
      return (this.module_data.trackersInfo || []).length > 0
    },

    quickInputFieldConfigs() {
      return QUICK_INPUT_FIELD_CONFIGS
    },

    quickInputReviewFieldLabel() {
      const fieldConfig = QUICK_INPUT_FIELD_CONFIGS[this.quickInputReviewFieldIndex]
      return fieldConfig ? fieldConfig.label : ''
    },

    allTrackersCollapsed() {
      const trackers = this.module_data.trackersInfo || []
      if (trackers.length === 0) {
        return false
      }

      return trackers.every((tracker) => this.isTrackerCollapsed(tracker))
    },

    hasPriceTableData() {
      const priceMsg = this.newModuleData && this.newModuleData.priceMsg
      return Array.isArray(priceMsg) && priceMsg.length > 0
    },

    highlightTotalTrackerNum() {
      const trackers = this.module_data.trackersInfo || []
      return trackers.reduce((sum, tracker) => sum + (parseInt(tracker.trackerNum, 10) || 0), 0)
    },

    highlightTotalCapacityText() {
      const capacity = this.newModuleData && this.newModuleData.planCapacity
      if (!capacity) {
        return '0.000'
      }
      return (capacity / 1000).toFixed(3)
    },

    hasCalculationBomError() {
      return (this.module_data.trackersInfo || []).some((tracker) => {
        const bomErr = tracker.resultList && tracker.resultList.bomErr
        return Array.isArray(bomErr) && bomErr.length > 0
      })
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
    scrollToTop() {
      const el = this.$el
      if (!el) {
        return
      }
      if (typeof el.scrollTo === 'function') {
        el.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        el.scrollTop = 0
      }
    },

    scrollToBottom() {
      const el = this.$el
      if (!el) {
        return
      }
      const top = el.scrollHeight - el.clientHeight
      if (typeof el.scrollTo === 'function') {
        el.scrollTo({ top, behavior: 'smooth' })
      } else {
        el.scrollTop = top
      }
    },

    scrollToSection(refName) {
      const container = this.$el
      const target = this.$refs[refName]
      if (!container || !target) {
        return
      }
      const section = Array.isArray(target) ? target[0] : target
      const containerRect = container.getBoundingClientRect()
      const sectionRect = section.getBoundingClientRect()
      const stickyOffset = 24
      const top = container.scrollTop + sectionRect.top - containerRect.top - stickyOffset
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      } else {
        container.scrollTop = Math.max(0, top)
      }
    },

    isTrackerCollapsed(tracker) {
      return !!tracker.uiMinimized
    },

    toggleAllTrackersMinimize() {
      const trackers = this.module_data.trackersInfo || []
      if (trackers.length === 0) {
        return
      }

      const shouldCollapse = !this.allTrackersCollapsed
      trackers.forEach((tracker) => {
        this.$set(tracker, 'uiMinimized', shouldCollapse)
      })
    },

    openQuickInputDialog() {
      const values = {}
      QUICK_INPUT_FIELD_CONFIGS.forEach((item) => {
        values[item.field] = ''
      })
      this.quickInputValues = values
      this.quickInputDialogVisible = true
    },

    applyQuickInputAll(fieldConfig) {
      this.applyQuickInputField(
        fieldConfig.field,
        this.quickInputValues[fieldConfig.field],
        fieldConfig.label,
        fieldConfig.inputType
      )
    },

    applyQuickInputField(fieldName, value, fieldLabel, inputType) {
      const isEmpty = value === '' || value == null
      if (isEmpty) {
        this.$message.warning(inputType === 'input' ? `请输入${fieldLabel}` : `请选择${fieldLabel}`)
        return
      }

      const trackers = this.module_data.trackersInfo || []
      if (trackers.length === 0) {
        this.$message.warning('当前没有可更新的支架')
        return
      }

      trackers.forEach((tracker) => {
        this.$set(tracker, fieldName, value)
      })
      this.$message.success(`已更新全部 ${trackers.length} 个支架的${fieldLabel}`)
    },

    openQuickInputSecondary(fieldConfig) {
      const trackers = this.module_data.trackersInfo || []

      this.quickInputCheckFieldName = fieldConfig.field
      this.quickInputCheckOptionKey = fieldConfig.optionKey || ''
      this.quickInputCheckInputType = fieldConfig.inputType
      this.quickInputCheckTitle = `${fieldConfig.label} - 二次输入`
      this.quickInputCheckRows = this.buildQuickInputTrackerRows(fieldConfig.field, trackers)
      this.quickInputCheckDialogVisible = true
    },

    buildQuickInputTrackerRows(fieldName, trackers) {
      return trackers.map((tracker) => ({
        id: tracker.id,
        trackBrifeName: tracker.trackBrifeName || tracker.id,
        fieldValue: tracker[fieldName]
      }))
    },

    applyQuickInputRowFieldValue(row, fieldName) {
      const tracker = (this.module_data.trackersInfo || []).find((item) => item.id === row.id)
      if (!tracker || !fieldName) {
        return
      }
      this.$set(tracker, fieldName, row.fieldValue)
    },

    applyQuickInputSecondaryRowValue(row) {
      this.applyQuickInputRowFieldValue(row, this.quickInputCheckFieldName)
    },

    openQuickInputReviewDialog() {
      this.quickInputReviewFieldIndex = 0
      this.loadQuickInputReviewField(0)
      this.quickInputReviewDialogVisible = true
    },

    loadQuickInputReviewField(index) {
      const fieldConfig = QUICK_INPUT_FIELD_CONFIGS[index]
      if (!fieldConfig) {
        return
      }

      const trackers = this.module_data.trackersInfo || []
      this.quickInputReviewFieldIndex = index
      this.quickInputReviewFieldName = fieldConfig.field
      this.quickInputReviewOptionKey = fieldConfig.optionKey || ''
      this.quickInputReviewInputType = fieldConfig.inputType
      this.quickInputReviewRows = this.buildQuickInputTrackerRows(fieldConfig.field, trackers)
    },

    showQuickInputReviewPrev() {
      if (this.quickInputReviewFieldIndex <= 0) {
        this.$message.info('已是第一个字段')
        return
      }
      this.loadQuickInputReviewField(this.quickInputReviewFieldIndex - 1)
    },

    showQuickInputReviewNext() {
      if (this.quickInputReviewFieldIndex >= QUICK_INPUT_FIELD_CONFIGS.length - 1) {
        this.$message.info('已是最后一个字段')
        return
      }
      this.loadQuickInputReviewField(this.quickInputReviewFieldIndex + 1)
    },

    applyQuickInputReviewRowValue(row) {
      this.applyQuickInputRowFieldValue(row, this.quickInputReviewFieldName)
    },

    handleQuickInputReviewDialogOpened() {
      this.$nextTick(() => {
        this.teardownQuickInputReviewDialogDrag()
        const dragDom = findDialogByClass('tracker-quick-input-review-dialog')
        this.unbindQuickInputReviewDialogDrag = bindDialogDrag(dragDom)
      })
    },

    handleQuickInputReviewDialogClosed() {
      this.teardownQuickInputReviewDialogDrag()
    },

    teardownQuickInputReviewDialogDrag() {
      if (this.unbindQuickInputReviewDialogDrag) {
        this.unbindQuickInputReviewDialogDrag()
        this.unbindQuickInputReviewDialogDrag = null
      }
      resetDialogPosition(findDialogByClass('tracker-quick-input-review-dialog'))
    },

    getDrawerTracker(tid) {
      const tracker = (this.newModuleData.trackersInfo || []).find((item) => item.id === tid)
      if (!tracker) {
        this.$message.warning('未找到支架计算结果')
        return
      }

      this.drawerTracker = tracker
      this.drawerTitle = tracker.trackBrifeName || '计算结果'
      this.drawer = true
    },

    handleDrawerClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },

    priceTableIndexMethod(index) {
      return index + 1
    },

    priceTableHandleEdit(row) {
      this.thePriceAdjust = row
      this.newPriceObj = {
        plan_code: this.thePlanCode,
        price_id: row.priceId,
        new_price: '',
        reason: '',
        price_adjuster: this.name
      }
      this.dialogVisiblePriceAdjust = true
    },

    isNumeric(value) {
      return !Number.isNaN(parseFloat(value)) && Number.isFinite(Number(value))
    },

    saveAdjustPrice() {
      if (!this.isNumeric(this.newPriceObj.new_price)) {
        this.$message.warning('输入新价格必须为数字格式')
        return
      }
      if (String(this.newPriceObj.reason || '').trim().length < 3) {
        this.$message.warning('调价原因为必填项')
        return
      }

      this.dialogVisiblePriceAdjust = false
      fetch(process.env.VUE_APP_BASE_API + '/api/saveAdjustPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: JSON.stringify(this.newPriceObj)
      })
        .then((response) => {
          if (response.ok) {
            return this.getAdjustPrice(this.thePlanCode)
          }
          throw new Error('Something went wrong on server side.')
        })
        .then(() => {
          this.$message.success('保存调价信息成功')
        })
        .catch((error) => {
          console.error('Error:', error)
          this.$message.error('保存调价信息失败，请稍后重试')
        })
    },

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

    initFileImportState(hasExistingTrackers) {
      if (this.fileImportStateInitialized) {
        return
      }
      this.fileImportEnabled = !hasExistingTrackers
      this.fileImportStateInitialized = true
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
            this.initFileImportState((this.module_data.trackersInfo || []).length > 0)
          } else {
            this.initFileImportState(false)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          this.initFileImportState(true)
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
      this.updateWeatherStationPrice()  //第1次导入时，更新气象站价格
    },

    handleFile(file) {
      const fileName = file.name
      apiTracker.getTextFileContent(file).then(content => {
        this.module_data.original_file_content.push({
          fileName: fileName,
          content: apiTracker.fileDataCleaning(content)
        })
        apiTracker.getTextFileContent(file).then(content => console.log("==============content=======================",content))
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
              apiTracker.trackStr2Obj(fileName, 'Exterior', cntObj,ui_model_info, model_dict.Exterior, initInfo,structure_results)
            )
          }
          if ('Edge' in model_dict && trackerList.includes('Edge')) {
            this.module_data.trackersInfo.push(
              apiTracker.trackStr2Obj(fileName, 'Edge', cntObj,ui_model_info, model_dict.Edge, initInfo,structure_results)
            )
          }
          if ('Interior' in model_dict && trackerList.includes('Interior')) {
            this.module_data.trackersInfo.push(
              apiTracker.trackStr2Obj(fileName, 'Interior', cntObj,ui_model_info, model_dict.Interior, initInfo,structure_results)
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
    },

    saveOrUpdatePlan() {
      this.module_data.plan_code = this.thePlanCode
      this.updatePlan(this.module_data)
    },

    withTimeout(promise, ms, timeoutMessage = 'CALCULATION_TIMEOUT') {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(timeoutMessage))
        }, ms)

        promise
          .then((value) => {
            clearTimeout(timer)
            resolve(value)
          })
          .catch((error) => {
            clearTimeout(timer)
            reject(error)
          })
      })
    },

    getCalculationLoadingText(elapsedSeconds, totalSeconds) {
      return `正在计算，已用时 ${elapsedSeconds} / ${totalSeconds} 秒。若 ${totalSeconds} 秒内未完成，将中断请求，请稍后重试。`
    },

    updateCalculationLoadingText(loading, elapsedSeconds, totalSeconds) {
      const text = this.getCalculationLoadingText(elapsedSeconds, totalSeconds)
      if (loading && typeof loading.setText === 'function') {
        loading.setText(text)
        return
      }
      const loadingTextEl = document.querySelector('.tracker-calculation-loading .el-loading-text')
      if (loadingTextEl) {
        loadingTextEl.textContent = text
      }
    },

    startCalculationLoadingProgress(loading, totalSeconds) {
      let elapsedSeconds = 0
      this.updateCalculationLoadingText(loading, elapsedSeconds, totalSeconds)

      const timer = setInterval(() => {
        elapsedSeconds += 1
        if (elapsedSeconds > totalSeconds) {
          return
        }
        this.updateCalculationLoadingText(loading, elapsedSeconds, totalSeconds)
      }, 1000)

      return () => clearInterval(timer)
    },

    submitTrackerCalculation(tracker) {
      tracker.ifCalculated = false
      tracker.resultList = []
      tracker.process_site = this.module_data.process_site

      return fetch(process.env.VUE_APP_BASE_API + '/api/submitData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: JSON.stringify({ data: tracker })
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Something went wrong on server side.')
          }
          return response.json()
        })
        .then((r) => {
          delete tracker.process_site
          tracker.ifCalculated = true
          tracker.resultList = {
            bom1Length: r.data.bomShow1.length,
            bom1: r.data.bomShow1,
            bomErr: r.data.bomShowErr
          }
          return tracker
        })
        .catch((error) => {
          delete tracker.process_site
          throw error
        })
    },

    async submitCalculation() {
      const trackers = this.module_data.trackersInfo || []
      if (trackers.length === 0) {
        this.$message.warning('请先导入支架数据后再提交计算')
        return
      }
      if (this.calculationSubmitting) {
        return
      }

      this.calculationSubmitting = true
      const timeoutSec = resolveCalculationTimeoutSeconds(trackers.length)
      const timeoutMs = timeoutSec * 1000
      let stopLoadingProgress = null
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: this.getCalculationLoadingText(0, timeoutSec),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.55)',
        customClass: 'tracker-calculation-loading'
      })
      stopLoadingProgress = this.startCalculationLoadingProgress(loading, timeoutSec)

      try {
        const results = await this.withTimeout(
          Promise.allSettled(trackers.map((tracker) => this.submitTrackerCalculation(tracker))),
          timeoutMs
        )

        const succeeded = results.filter((item) => item.status === 'fulfilled')
        const failed = results.filter((item) => item.status === 'rejected')

        if (failed.length === 0) {
          this.$message.success(`计算完成，共 ${succeeded.length} 个支架`)
          return
        }

        if (succeeded.length === 0) {
          this.$message.error('计算失败，请检查输入后重试')
          return
        }

        this.$message.warning(`部分支架计算失败：成功 ${succeeded.length} 个，失败 ${failed.length} 个`)
      } catch (error) {
        if (error && error.message === 'CALCULATION_TIMEOUT') {
          this.$message.error(`计算超时（${timeoutSec} 秒），请求已中断，请稍后重试`)
        } else {
          console.error('Error:', error)
          this.$message.error('计算过程出现异常，请稍后重试')
        }
      } finally {
        if (stopLoadingProgress) {
          stopLoadingProgress()
        }
        loading.close()
        this.calculationSubmitting = false
      }
    },

    updatePlan(subData) {
      fetch(process.env.VUE_APP_BASE_API + '/api/submitUpdatePlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()
        },
        body: JSON.stringify(subData)
      })
        .then((response) => {
          if (response.ok) {
            alert('更新项目方案成功!')
            return response.json()
          }
          throw new Error('Something went wrong on server side.')
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  },

  created() {
    const hasExistingPlanCode = this.planCode !== undefined || (this.msg && this.msg.planCode)
    if (hasExistingPlanCode) {
      this.fileImportEnabled = false
    }

    if (this.planCode !== undefined) {
      this.thePlanCode = this.planCode
      this.getThisPlanDetail(this.planCode)
    } else if (this.msg && this.msg.planCode) {
      this.thePlanCode = this.msg.planCode
      this.getThisPlanDetail(this.msg.planCode)
    } else {
      this.thePlanCode = String(Date.now())
      this.initFileImportState(false)
    }
    this.getAdjustPrice(this.thePlanCode)
  },

  beforeDestroy() {
    this.teardownQuickInputReviewDialogDrag()
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

.tracker-scroll-top-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  height: 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(228, 231, 237, 0.9);
  box-sizing: border-box;
}

.tracker-scroll-top-bar__placeholder {
  flex: 1;
}

.tracker-scroll-top-bar__nav {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.tracker-scroll-top-bar__actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.tracker-scroll-top-bar__btn {
  height: 16px;
  margin: 0;
  padding: 0 6px;
  line-height: 16px;
  font-size: 12px;
}

.tracker-scroll-top-bar__btn ::v-deep span {
  line-height: 16px;
}

/* 外层分区容器：后续每个 tracker-section 复用 */
.tracker-section {
  position: relative;
  width: 100%;
  max-width: 1200px;
  min-height: 120px;
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
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
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

.tracker-highlight-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  margin-bottom: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #87ceeb;
  box-sizing: border-box;
}

.tracker-highlight-bar__stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  min-width: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.82);
  box-sizing: border-box;
  flex-shrink: 0;
}

.tracker-highlight-bar__stat-label {
  font-size: 12px;
  line-height: 1;
  color: #606266;
  white-space: nowrap;
}

.tracker-highlight-bar__stat-value {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: #303133;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tracker-highlight-bar__alert {
  flex: 1;
  width: auto;
  min-width: 0;
  padding: 0 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  color: #f56c6c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: tracker-highlight-bar-alert-blink 0.5s linear infinite;
}

@keyframes tracker-highlight-bar-alert-blink {
  0%, 49.9% {
    opacity: 1;
  }

  50%, 100% {
    opacity: 0.45;
  }
}

.tracker-highlight-bar__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.tracker-highlight-bar__action-btn {
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.82);
  color: #303133;
  font-size: 12px;
  line-height: 28px;
}

.tracker-highlight-bar__action-btn:hover,
.tracker-highlight-bar__action-btn:focus {
  background: rgba(255, 255, 255, 0.95);
  color: #409eff;
}

.tracker-highlight-bar__action-btn ::v-deep span {
  line-height: 28px;
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

.summary-price {
  margin-top: 12px;
  overflow-x: hidden;
}

.summary-price__table {
  width: 100%;
}

.summary-price__popover {
  max-height: 320px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.6;
}

.summary-price__adjust-item + .summary-price__adjust-item {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.summary-price__cost {
  color: #f56c6c;
  margin-right: 12px;
}

.summary-price__cost-tag {
  display: inline-block;
}

.summary-price__cost-mark {
  color: #f56c6c;
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
    justify-content: flex-end;
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

<style>
.tracker-calculation-loading.is-fullscreen {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tracker-calculation-loading.is-fullscreen .el-loading-spinner {
  position: static;
  top: auto;
  margin-top: 0;
  width: 100%;
  max-width: 420px;
}

.tracker-calculation-loading .el-loading-text {
  max-width: 420px;
  line-height: 1.6;
  white-space: normal;
  text-align: center;
}

.tracker-quick-input-dialog .el-dialog__body {
  max-height: 70vh;
  overflow-y: auto;
}

.tracker-quick-input-dialog .tracker-quick-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tracker-quick-input-dialog .tracker-quick-input-row + .tracker-quick-input-row {
  margin-top: 16px;
}

.tracker-quick-input-dialog .tracker-quick-input-row__label {
  flex-shrink: 0;
  width: 80px;
  font-size: 13px;
  color: #606266;
}

.tracker-quick-input-dialog .tracker-quick-input-row__value {
  flex: 1;
  min-width: 168px;
}

.tracker-quick-input-dialog .tracker-quick-input-row__apply,
.tracker-quick-input-dialog .tracker-quick-input-row__secondary {
  flex-shrink: 0;
}

.tracker-quick-input-dialog__footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #e4e7ed;
  text-align: center;
}

.tracker-quick-input-review-dialog .tracker-quick-input-review__field-title {
  margin-bottom: 12px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  background: #f5f7fa;
  border-left: 3px solid #409eff;
  border-radius: 4px;
}

.tracker-quick-input-review-dialog .tracker-quick-input-review__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.tracker-quick-input-review-dialog .tracker-quick-input-review__progress {
  margin-right: auto;
  font-size: 13px;
  color: #909399;
}

.tracker-quick-input-check-dialog .tracker-quick-input-check-table {
  width: 100%;
}

.tracker-quick-input-check-dialog .tracker-quick-input-check-table__editor {
  width: 100%;
}
</style>
