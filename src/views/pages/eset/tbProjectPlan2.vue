<template>
  <div id="app-container">
    <div class="badges">
      <div class="div-badge" @click="showItemStructure = !showItemStructure">
        <el-badge :value="projectListStructure.length" class="item"
                  :type="projectListStructure.length>0?'danger':'primary'"
        >
          <el-button size="small">正在设计的项目</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showItemGeotechnical = !showItemGeotechnical">
        <el-badge :value="myPlanListGeotechnical.length" class="item"
                  :type="myPlanListGeotechnical.length>0?'danger':'primary'"
        >
          <el-button size="small">岩土基础方案设计</el-button>
        </el-badge>
      </div>
      <div class="div-badge" @click="showItemStructureCheck = !showItemStructureCheck">
        <el-badge :value="myCheckPlanListStructure.length" class="item"
                  :type="myCheckPlanListStructure.length>0?'danger':'primary'"
        >
          <el-button size="small">上部结构方案校核</el-button>
        </el-badge>
      </div>
<!--      <div class="div-badge" @click="showItemGeotechnicalCheck = !showItemGeotechnicalCheck">-->
<!--        <el-badge :value="myCheckPlanListGeotechnical.length" class="item"-->
<!--                  :type="myCheckPlanListGeotechnical.length>0?'danger':'primary'"-->
<!--        >-->
<!--          <el-button size="small">岩土基础方案校核</el-button>-->
<!--        </el-badge>-->
<!--      </div>-->
    </div>
    <el-divider></el-divider>
    <!--    从下是正文部分-->
    <div class="structure-working">
      <h2 @click="showItemStructure = !showItemStructure">我的项目(上部结构)</h2>
      <div class="container" style="overflow-x:auto" v-show="showItemStructure">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="p in projectListStructure" :title="p.code + ` `+ p.name " :key="p.id">
            <div>项目编号：
              <el-button @click="projectDetails(p.code)" type="text" size="small">{{ p.code }}</el-button>
            </div>
            <div>所在地：{{ p.site }}</div>
            <div>支架类别：{{ p.category }}</div>
            <div>结构工程师：{{ p.designer }}</div>
            <div>岩土工程师：{{ p.geotechnical }}</div>
            <div>销售经理：{{ p.seller }}</div>
            <div>校对人员：{{ p.checker }}</div>
            <div>技术总负责：{{ p.technical_director }}</div>
            <div>项目创建时间：{{ p.create_time|filterLocalTime }}</div>
            <div>要求完成时间：{{ p.required_completion_time }}</div>
            <div>销售经理提资链接：<a style="color:#20a0ff" :href="p.data_link" target="_blank"
            >{{ p.data_link|filterLink(36) }}</a></div>
            <div>当前设计版本：{{ p.design_version|filterDesignVersion }}</div>
            <div>
              <el-button type="primary" size="mini" @click="showDialogCreatPlan(p)">创建新方案</el-button>
            </div>
            <el-table :data="myPlanListStructure.filter(data => data.project_code === p.code)" border
                      style="width: 100%"
            >
              <el-table-column prop="plan_description" label="方案名称" width="200" sortable></el-table-column>
              <el-table-column prop="project_design_version" label="变更号" width="100"></el-table-column>
              <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
              <el-table-column prop="plan_status" label="状态" width="140">
                <template slot-scope="scope">
                  {{ scope.row.plan_status|filterPlanStatus }}
                </template>
              </el-table-column>
              <el-table-column prop="struChecker" label="结构校核人" width="120">
                <template slot-scope="scope">
                  <el-button @click="showDialogSubmitCheckStru(scope.row)" type="text" size="small">
                    {{ scope.row.stru_checker|filterChecker }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="stru_result_data_link" label="上部结构成果资料" width="80"
                               :formatter="formatDataLink"
              ></el-table-column>
              <el-table-column prop="stru_check_status" label="结构校核状态" width="100" :formatter="formatCheckStatusStru"
              ></el-table-column>

              <el-table-column prop="geotechnical" label="岩土工程师" width="140">
                <template slot-scope="scope">
                  <p v-show="['0'].includes(scope.row.geo_check_status)">待指派</p>
                  <p v-show="['1','2','3'].includes(scope.row.geo_check_status)">{{ scope.row.geotechnical }}</p>
                  <el-button v-show="!['0','1','2','3'].includes(scope.row.geo_check_status)" @click="showDialogAssignGeo(scope.row)" type="text" size="small">
                    点击申请
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="data_link_to_geotechnical" label="岩土提资资料" width="80"
                               :formatter="formatDataLink"
              >
              </el-table-column>
              <el-table-column prop="geo_required_completion_time" label="岩土要求完成时间" width="160" sortable
              ></el-table-column>
              <el-table-column prop="geo_check_status" label="岩土进展" width="110" :formatter="formatCheckStatusStru"
              ></el-table-column>
              <el-table-column prop="geo_result_data_link" label="岩土成果" width="180"
                               :formatter="formatDataLink"
              >
                <template slot-scope="scope">
                  <a style="color:#20a0ff" :href="scope.row.geo_result_data_link" target="_blank"
                  >{{ scope.row.geo_result_data_link|filterLink(30) }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="create_time" label="方案创建日期" width="160" sortable>
                <template slot-scope="scope">{{ scope.row.create_time | filterLocalTime }}</template>
              </el-table-column>
              <el-table-column prop="update_time" label="最后保存时间" width="200" sortable>
                <template slot-scope="scope">
                  <template v-for="ago in [getUpdateTimeAgoParts(scope.row.update_time)]">
                    <span
                      v-if="ago.text"
                      :key="(scope.row.id || scope.row.plan_code) + '-' + ago.text + ago.color"
                      :style="{ color: ago.color }"
                    >{{ ago.text }}</span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="工具" width="150">
                <template slot-scope="scope">
                  <button v-if="scope.row.category==='1P Tracker' || scope.row.category==='2P Tracker'"
                          @click="showTrackerBom(scope.row,p,true)"
                  >跟踪支架BOM
                  </button>
                  <button v-if="scope.row.category !=='1P Tracker' && scope.row.category !=='2P Tracker'"
                          @click="showOtherBom(scope.row.plan_code,p)"
                  >导入BOM表
                  </button>
                </template>
              </el-table-column>
              <el-table-column fixed="left" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="showDialogUpdatePlan(scope.row)" type="text" size="small">修改</el-button>
                  <el-button @click="removePlanById(scope.row)" type="text" size="small">删除</el-button>
                  <el-button v-if="scope.row.plan_status === '0'" @click="showDialogSubmitApprovePlan(scope.row)"
                             type="text" size="small"
                  >提交审批
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <el-divider></el-divider>

    <div class="geotechnical-working">
      <h2 @click="showItemGeotechnical = !showItemGeotechnical">我的方案(岩土基础)</h2>
      <div class="container" v-show="showItemGeotechnical">
        <div>
          <el-table :data="myPlanListGeotechnical" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140"></el-table-column>
            <el-table-column prop="geotechnical" label="岩土工程师" width="140"></el-table-column>
            <el-table-column prop="data_link_to_geotechnical" label="岩土提资资料" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.data_link_to_geotechnical" target="_blank"
                >{{ scope.row.data_link_to_geotechnical|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="geoChecker" label="岩土校审" width="120">
              <template slot-scope="scope">
                <p v-show="['2','3'].includes(scope.row.geo_check_status)">已提交</p>
                <el-button v-show="['1'].includes(scope.row.geo_check_status)" @click="showDialogSubmitCheckGeo(scope.row)" type="text" size="small">
                  点击提交
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="geo_result_data_link" label="岩土基础成果资料" width="140"
                             :formatter="formatDataLink"
            ></el-table-column>
            <el-table-column prop="geo_check_status" label="当前进展" width="110" :formatter="formatCheckStatusGeo"
            ></el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>

          </el-table>
        </div>
      </div>
    </div>
    <el-divider></el-divider>

    <div class="structure-checking">
      <h2 @click="showItemStructureCheck = !showItemStructureCheck">我的校对方案(上部结构)</h2>
      <div class="container" v-show="showItemStructureCheck">
        <div>
          <el-table :data="myCheckPlanListStructure" border style="width: 100%">
            <el-table-column prop="project_code" label="项目编号" width="120" sortable>
              <template slot-scope="scope">
                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">
                  {{ scope.row.project_code }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>
            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>
            <el-table-column prop="designer" label="结构工程师" width="140">
            </el-table-column>
            <el-table-column prop="stru_result_data_link" label="待校核资料(上部结构)" width="220"
                             :formatter="formatDataLink"
            >
              <template slot-scope="scope">
                <a style="color:#20a0ff" :href="scope.row.stru_result_data_link" target="_blank"
                >{{ scope.row.stru_result_data_link|filterLink(30) }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>

            <el-table-column label="工具" width="150">
              <template slot-scope="scope">
                <button v-if="scope.row.tracker_info_num >0 && (scope.row.category==='1P Tracker' || scope.row.category==='2P Tracker')"
                        @click="showTrackerBom(scope.row)"
                >跟踪支架BOM
                </button>
                <button v-if="scope.row.tracker_info_num >0 && scope.row.category !=='1P Tracker' && scope.row.category !=='2P Tracker'"
                        @click="showOtherBom(scope.row.plan_code)"
                >导入BOM表
                </button>
              </template>
            </el-table-column>
            <el-table-column fixed="left" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="showDialogStruCheckerApprove(scope.row)" type="text" size="small">校核通过
                </el-button>
                <el-button @click="showDialogStruCheckerReject(scope.row)" type="text" size="small">校核驳回</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <!--我的校对方案(岩土基础)-->
<!--    <div class="geotechnical-checking">-->
<!--      <h2 @click="showItemGeotechnicalCheck = !showItemGeotechnicalCheck">我的校对方案(岩土基础)</h2>-->
<!--      <div class="container" v-show="showItemGeotechnicalCheck">-->
<!--        <div>-->
<!--          <el-table :data="myCheckPlanListGeotechnical" border style="width: 100%">-->
<!--            <el-table-column prop="project_code" label="项目编号" width="120" sortable>-->
<!--              <template slot-scope="scope">-->
<!--                <el-button @click="projectDetails(scope.row.project_code)" type="text" size="small">-->
<!--                  {{ scope.row.project_code }}-->
<!--                </el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="plan_description" label="方案名称" width="300" sortable></el-table-column>-->
<!--            <el-table-column prop="category" label="结构类型" width="140"></el-table-column>-->
<!--            <el-table-column prop="designer" label="岩土工程师" width="140">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="data_link_to_geotechnical" label="结构师提资岩土工程师资料" width="220"-->
<!--                             :formatter="formatDataLink"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <a style="color:#20a0ff" :href="scope.row.data_link_to_geotechnical" target="_blank"-->
<!--                >{{ scope.row.data_link_to_geotechnical|filterLink(30) }}</a>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="geo_result_data_link" label="待校核资料(岩土基础)" width="220"-->
<!--                             :formatter="formatDataLink"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <a style="color:#20a0ff" :href="scope.row.geo_result_data_link" target="_blank"-->
<!--                >{{ scope.row.geo_result_data_link|filterLink(30) }}</a>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="design_version" label="变更号" width="80"></el-table-column>-->

<!--            <el-table-column fixed="left" label="操作" width="160">-->
<!--              <template slot-scope="scope">-->
<!--                <el-button @click="showDialogGeoCheckerApprove(scope.row)" type="text" size="small">校核通过</el-button>-->
<!--                <el-button @click="showDialogGeoCheckerReject(scope.row)" type="text" size="small">校核驳回</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->


    <!--结构方案表单对话框-->
    <div class="dialog-plan">
      <el-dialog :title="planDialogTitle" :visible.sync="planDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <el-form ref="dataForm" :model="thePlan" :rules="planRules" label-width="120px" size="small"
                 style="padding-right: 40px;"
        >
          <el-form-item label="id" prop="id" v-show="false">
            <el-input v-model="thePlan.id" :disabled="true"/>
          </el-form-item>
          <el-form-item label="项目编号" prop="projectCode">
            <el-input v-model="thePlan.projectCode" :disabled="true"/>
          </el-form-item>

          <el-form-item label="方案编号" prop="planCode" v-show="false">
            <el-input v-model="thePlan.planCode"/>
          </el-form-item>

          <el-form-item label="支架类型" prop="category">
            <el-row :gutter="0">
              <el-select v-model="thePlan.category" placeholder="Please select the category"
                         :disabled="!planDialogFieldDisabled.includes('category')"
              >
                <el-option v-for="option in mydata.select_option.category" :key="option.value" :label="option.label"
                           :value="option.value"
                >
                </el-option>
              </el-select>
            </el-row>
          </el-form-item>

          <el-form-item label="结构工程师" prop="designer">
            <el-input v-model="thePlan.designer" disabled/>
          </el-form-item>

          <el-form-item label="方案名称" prop="planDescription">
            <el-input v-model="thePlan.planDescription" clearable minlength="4" maxlength="100" show-word-limit
                      placeholder="Please text the description about the plan"
                      :disabled="!planDialogFieldDisabled.includes('planDescription')"
            />
          </el-form-item>


          <el-form-item label="结构校对人" prop="struChecker" v-show="planDialogFieldVisible.includes('struChecker')">
            <el-select v-model="thePlan.struChecker" placeholder="please select">
              <el-option
                v-for="item in designer_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="结构成果链接" prop="struResultDataLink"
                        v-show="planDialogFieldVisible.includes('struResultDataLink')"
          >
            <el-input v-model="thePlan.struResultDataLink" placeholder="https://freefs.esetsolar.com/..."/>
          </el-form-item>

          <el-form-item label="结构校核状态" prop="struCheckStatus"
                        v-show="planDialogFieldVisible.includes('struCheckStatus')"
          >
            <el-input v-model="thePlan.struCheckStatus"/>
          </el-form-item>

          <el-form-item label="外链数据行数" prop="trackerInfoNum"
                        v-show="planDialogFieldVisible.includes('trackerInfoNum')"
          >
            <el-input v-model="thePlan.trackerInfoNum"/>
          </el-form-item>

          <el-form-item label="岩土工程师" prop="geotechnical" v-show="planDialogFieldVisible.includes('geotechnical')">
            <el-select v-model="thePlan.geotechnical" placeholder="please select" clearable>
              <el-option
                v-for="item in designer_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="岩土校对人" prop="geoChecker" v-show="planDialogFieldVisible.includes('geoChecker')">
            <el-select v-model="thePlan.geoChecker" placeholder="please select">
              <el-option
                v-for="item in designer_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="岩土提资资料" prop="dataLinkToGeotechnical"
                        v-show="planDialogFieldVisible.includes('dataLinkToGeotechnical')"
          >
            <el-input v-model="thePlan.dataLinkToGeotechnical" placeholder="https://freefs.esetsolar.com/..."/>
          </el-form-item>

          <el-form-item label="要求完成时间" prop="geoRequiredCompletionTime"
                        v-show="planDialogFieldVisible.includes('geoRequiredCompletionTime')"
          >
            <el-date-picker
              v-model="thePlan.geoRequiredCompletionTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="岩土成果链接" prop="geoResultDataLink"
                        v-show="planDialogFieldVisible.includes('geoResultDataLink')"
          >
            <el-input v-model="thePlan.geoResultDataLink" placeholder="https://freefs.esetsolar.com/..."/>
          </el-form-item>

          <el-form-item label="岩土校核状态" prop="geoCheckStatus"
                        v-show="planDialogFieldVisible.includes('geoCheckStatus')"
          >
            <el-input v-model="thePlan.geoCheckStatus"/>
          </el-form-item>

          <el-form-item label="补充说明" prop="geoCheckStatus"
                        v-show="!planDialogFieldDisabled.includes('category')"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="非必填"
              maxlength="500"
              show-word-limit
              v-model="approveTextarea"
            >
            </el-input>
          </el-form-item>

          <div style="padding: 0 0 20px 20px">
            <el-link type="primary" href="https://freefs.esetsolar.com/" target="_blank">click here go to cloud disk
              website / 跳转到云盘提资资料网站
            </el-link>
          </div>

          <h4 v-if="structureDialogMsg_cn.length" style="color: green;margin-top: 20px">
            提示:{{ structureDialogMsg_cn }}</h4>
          <h4 v-if="structureDialogMsg_en.length" style="color: green;margin-top: 20px">
            hint:{{ structureDialogMsg_en }}</h4>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="planDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="saveOrUpdatePlan()" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>

    <div class="drawer">
      <el-drawer
        title="项目信息"
        :visible.sync="drawer"
        :direction="direction"
        :destroy-on-close="true"
        size="50%"
        :before-close="handleClose"
      >
        <div v-if="drawerContext === 'projectList'">
          <P>{{ confirmMsg }}</P>
          <ProjectManagement :project_code="showDetailProjectCode"></ProjectManagement>
        </div>
      </el-drawer>
    </div>

    <div class="drawer">
      <el-drawer
        title="Tracker BOM 清单"
        :visible.sync="drawerTrackerBomVisible"
        direction="rtl"
        :destroy-on-close="true"
        size="100%"
        :before-close="handleCloseTrackerBom"
      >
        <TrackerIndex :msg="theBomMsg" :saveable="saveable"></TrackerIndex>
      </el-drawer>
    </div>

    <div class="drawer">
      <el-drawer
        title="支架 BOM 清单"
        :visible.sync="drawerOtherBomVisible"
        direction="rtl"
        :destroy-on-close="true"
        size="100%"
        :before-close="handleCloseExcelBom"
      >
        <tbImportBom :planCode="thePlanCode" :saveable="false" :modifiable="false" :bomindex="1"></tbImportBom>
      </el-drawer>
    </div>



    <!--校核审批对话框-->
    <div class="dialog-approve">
      <el-dialog :title="approveDialogTitle" :visible.sync="approveDialogVisible" width="40%"
                 :close-on-click-modal="false"
      >
        <p>原因或备注</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          maxlength="500"
          show-word-limit
          v-model="approveTextarea"
        >
        </el-input>

        <span slot="footer" class="dialog-footer">
            <el-button @click="approveDialogVisible = false" size="small" icon="el-icon-refresh-right"
            >取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="makeSureApprove()" size="small"
            >确 定</el-button>
          </span>
      </el-dialog>
    </div>


  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import apiPlan from '@/api/eset/tbProjectPlan'
import mydata from '@/api/eset/mydata'
import ProjectManagement from '@/views/pages/eset/trackers2/ProjectManagement.vue'
import TrackerIndex from '@/views/pages/eset/trackers2/TrackerIndex.vue'
import tbImportBom from '@/views/pages/eset/tbImportBom.vue'
import myUtils from '@/api/eset/myUntils'

/** 与 filterLocalTime 一致：按本地年月日解析后再减 8 小时，得到用于展示/计算的毫秒时间戳 */
function parsePlanServerTimeMs(value) {
  if (value === undefined || value === null || value === '') return null
  const d = String(value).split(/[-:\s]/)
  if (d.length < 5) return null
  d[1] = d[1] - 1
  const t = new Date(...d.map(Number)).getTime() - 8 * 3600 * 1000
  return Number.isNaN(t) ? null : t
}

const defaultForm = {}

export default {
  components: { ProjectManagement, TrackerIndex,tbImportBom },

  data() {
    return {
      theBomMsg:{},//查看Bom表时，要传给Bom表的信息
      theProject: {},  //当前正在操作的项目
      thePlan: {},  //当前正在操作的方案
      thePlanCode:'',//正在操作的方案号
      theRoles:0,//当前我的身份
      theProjectLog: {},  //当前正在操作的项目日志
      activeNames: ['1'],
      projectList: [],  //我正在参与的全部项目（包含正在上部设计，基础设计和校对的）
      projectListStructure: [],  //projectList的子集，我正在设计的结构项目
      projectListGeotechnical: [],  //projectList的子集，我正在设计的岩土项目
      projectListChecker: [],  //projectList的子集，我正在校对的项目

      designer_option:[],//全部技术工程师列表

      //drawer相关
      showDetailProjectCode: '',//显示项目详情时的项目号
      drawer: false,
      direction: 'ltr',
      drawerContext: 'assignment', //当为projectList 时，打开项目详情
      confirmMsg: '',

      drawerTrackerBomVisible:false,
      drawerOtherBomVisible: false,
      bomModifiable:false,  //bom表是否可以被更新

      //对话框相关
      planDialogTitle: '',//方案对话框标题
      planDialogVisible: false,//方案对话框可视

      planRules: {},  //对话框校验规则
      planDialogFieldVisible: [],  //字段控制，控制方案对话框字段可见性
      planDialogFieldDisabled: [],  //字段控制，控制方案对话框字段可编辑性。当为空时，表示所有的都能被编辑
      structureDialogMsg_cn: '',  //如果有说明，则加在对话框中
      structureDialogMsg_en: '',  //如果有说明，则加在对话框中
      myPlanListStructure: [],// 我的方案-上部结构
      myPlanListGeotechnical: [],// 我的方案-基础岩土
      myCheckPlanListStructure: [],// 我校核的方案-上部结构
      myCheckPlanListGeotechnical: [],// 我校核的方案-基础岩土

      //对话框相关
      approveTextarea: '',
      approveDialogTitle: '',//方案对话框标题
      approveDialogVisible: false,//方案对话框可视

      //控制四类任务显示
      showItemStructure: false,
      showItemGeotechnical: false,
      showItemStructureCheck: false,
      showItemGeotechnicalCheck: false,

      saveable:false  //方案是否能够被修改

    }
  },
  computed: {
    mydata() {
      return mydata
    },
    ...mapGetters([
      'name'
    ])

  },
  methods: {
    //跟踪支架，打开BOM计算工具

    showTrackerBom(plan,project,saveable) {
      if(saveable === undefined){
        this.saveable = false;  //控制是否有修改并保存方案的权限
      } else {
        this.saveable = saveable;
      }

      if(project === undefined){
        this.theBomMsg = {
          planCode : plan.plan_code,
          planDesc : plan.plan_description,
          version : plan.version,
          designer : plan.designer,
          projectCode : plan.project_code,
          seller : '',
          projectName : ''
        }
      } else {
        this.theBomMsg = {
          planCode : plan.plan_code,
          planDesc : plan.plan_description,
          version : plan.version,
          designer : this.name,
          projectCode : project.code,
          seller : project.seller,
          projectName : project.name
        }
      }
      //以抽屉方式打开跟踪支架报价工具，后面再完成
      this.drawerTrackerBomVisible = true
    },
    //其它类型支架，导入excel
    showOtherBom(planCode) {
      this.thePlanCode = planCode
      //以抽屉方式打开跟踪支架报价工具，后面再完成
      this.drawerOtherBomVisible = true
    },

    projectDetails(projectCode) {
      this.drawerContext = 'projectList'
      this.direction = 'rtl'
      this.drawer = true
      this.showDetailProjectCode = projectCode
    },
    handleClose(done) {
      done()
    },
    handleClick(row) {

    },
    handleChange(val) {

    },
    handleCloseTrackerBom(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.fetchProjectData()
          done()
        })
        .catch(_ => {
        })
    },
    handleCloseExcelBom(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.fetchProjectData()
          done()
        })
        .catch(_ => {
        })
    },

    //获取我正在参与的项目信息
    fetchProjectData() {
      this.listLoading = true
      fetch(process.env.VUE_APP_BASE_API + '/api/getEngineerTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: this.name
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
          this.projectList = r.data
          console.log('projectList:', this.projectList);
          
          //分成上部结构任务和岩土任务
          this.projectListStructure = []
          this.projectListGeotechnical = []
          this.projectListChecker = []
          this.projectList.forEach(p => {
            if (p !== null && p !== undefined) {
              if (p.designer !== null && p.designer.includes(this.name)) {
                this.projectListStructure.push(p)
              }
              if (p.geotechnical !== null && p.geotechnical.includes(this.name)) {
                this.projectListGeotechnical.push(p)
              }
              if (p.checker !== null && p.checker.includes(this.name)) {
                this.projectListChecker.push(p)
              }
            }
          })

          this.listLoading = false
          return r.data
        })
        .then(r => {
          let arr = []
          r.forEach(p => arr.push(p.code))
          this.fetchPlanData(arr.join(','))  //将我当前正在参与的全部项目，去取全部的方案
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    //获取全部项目工程师
    getAllTechnicalEngineers() {
      let engineers = []
      fetch(process.env.VUE_APP_BASE_API + '/api/getAllTechnicalEngineers', {
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
          this.designer_option = []
          r.data.forEach(item => this.designer_option.push({ value: item.fullname, label: item.fullname }))
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
          return []
        })
    },
    //正在报价中的项目的方案
    fetchPlanData(planCodes) {
      fetch(process.env.VUE_APP_BASE_API + '/api/getPlanByCodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: planCodes
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          this.myPlanListStructure = r.data.filter(p => p.designer === this.name && p.design_version === p.project_design_version)
          this.myPlanListGeotechnical = r.data.filter(p => p.geotechnical === this.name && p.design_version === p.project_design_version)
          this.myCheckPlanListStructure = r.data.filter(p => p.stru_checker === this.name && p.stru_check_status === '1' && p.design_version === p.project_design_version)
          // this.myCheckPlanListGeotechnical = r.data.filter(p => p.geo_checker === this.name && p.geo_check_status === '1' && p.design_version === p.project_design_version)
        })
    },

    /**
     * 1、结构工程师
     * 创建方案
     * 指定岩土
     * 结构工程师提交结构部分校对
     * 结构、岩土都校对完成，提交给总监，方案完成
     * 2、岩土工程师
     * 提交校对
     * 提交给结构工程师
     */
    //创建新方案
    showDialogCreatPlan(project) {
      this.planDialogFieldVisible = []  //字段可见性
      this.planDialogFieldDisabled = ['category', 'planDescription']  //字段可编辑
      this.planDialogTitle = '增加项目方案-' + project.name
      this.thePlan = {
        planCode: Date.now(),
        projectCode: project.code,
        planDescription: '',
        category: project.category,
        planStatus: 0,
        projectDesignVersion:project.design_version,
        designer: this.name,
        struResultDataLink: '',
        struChecker: '',
        struCheckStatus: '',
        trackerInfoNum: 0,
        adjustPriceMsg: '',
        geotechnical: '',
        dataLinkToGeotechnical: '',
        geoRequiredCompletionTime: '',
        geoResultDataLink: '',
        geoChecker: '',
        geoCheckStatus: ''
      }  //初始化一个plan
      this.planRules = {}
      this.planRules.planDescription = [
        { required: true, message: 'Please enter the plan name for easy identification', trigger: 'blur' },
        { min: 3, max: 100, message: 'Length of 3 to 100 characters', trigger: 'blur' }
      ]
      this.planDialogVisible = true  //显示对话框
    },
    //修改新方案
    showDialogUpdatePlan(row) {
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.planDialogFieldDisabled = []  //字段可编  //字段可见性
      this.planDialogFieldDisabled = ['category', 'planDescription']  //字段可编辑
      this.planDialogTitle = '修改信息-' + this.theProject.name
      this.planRules = {}
      this.planRules.planDescription = [
        { required: true, message: 'Please enter the plan name for easy identification', trigger: 'blur' },
        { min: 3, max: 100, message: 'Length of 3 to 100 characters', trigger: 'blur' }
      ]
      this.theProjectLog = {
        project_code: row.project_code,
        action: '修改方案信息',
        action_remark: '原方案名称:' + row.plan_description + '原支架类型:' + row.category,
        role: '结构工程师',
        operator: this.name,
        to_person: '',
        to_id: row.id,
        content: ''
      }
      this.planDialogVisible = true  //显示对话框
    },
    //申请岩土工程师协助
    showDialogAssignGeo(row) {
      this.theRoles = ''
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.geoCheckStatus = '0'  //将状态变为1，表示正在审核中的状态
      this.planDialogFieldVisible = [ 'dataLinkToGeotechnical', 'geoRequiredCompletionTime'] //字段可见性
      this.planDialogFieldDisabled = []  //字段可编辑
      this.planDialogTitle = '申请岩土工程师协助-' + this.theProject.name
      this.planRules = {}
      this.planRules.dataLinkToGeotechnical = [
        { required: true, message: 'Geotechnical data is required', trigger: 'blur' }
      ]
      this.planRules.geoRequiredCompletionTime = [
        { required: true, message: 'Completion time engineer is required', trigger: 'blur' }
      ]
      let action = '申请岩土工程师'
      this.theProjectLog = {
        project_code: row.project_code,
        action: action,
        action_remark: '方案名称:' + row.plan_description,
        role: '结构工程师',
        operator: this.name,
        to_person: '王浩然',
        to_id: row.id,
        content: ''
      }
      this.planDialogVisible = true  //显示对话框
    },
    //结构部分设计完成,提交校对
    showDialogSubmitCheckStru(row) {
      this.theRoles = ''
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.struCheckStatus = '1'  //将状态变为1，表示正在审核中的状态
      this.planDialogFieldVisible = ['struResultDataLink', 'struChecker']  //字段可见性
      this.planDialogFieldDisabled = []  //字段可编辑
      this.planDialogTitle = '上部结构提交校对-' + this.theProject.name
      this.planRules = {}
      this.planRules.struChecker = [
        { required: true, message: 'Structure checker is required', trigger: 'blur' }
      ]
      this.planRules.struResultDataLink = [
        { required: true, message: 'Structure data is required', trigger: 'blur' }
      ]
      let action = '指定上部结构校对人'
      if (row.designer !== null && row.designer !== undefined && row.designer.trim().length > 1) {
        action = '变更指定上部结构校对人'
      }
      this.theProjectLog = {
        project_code: row.project_code,
        action: action,
        action_remark: '方案名称:' + row.plan_description,
        role: '结构工程师',
        operator: this.name,
        to_person: '',
        to_id: row.id,
        content: ''
      }
      this.planDialogVisible = true  //显示对话框
    },
    //岩土基础设计完成,提交校对
    showDialogSubmitCheckGeo(row) {
      this.theRoles = ''
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.geoCheckStatus = '2'  //表示正在审核中的状态
      this.thePlan.geoChecker = '王浩然'  //固定岩土负责人就是校对人
      this.planDialogFieldVisible = ['geoResultDataLink']  //字段可见性
      this.planDialogFieldDisabled = []  //字段可编辑
      this.planDialogTitle = '岩土基础提交校审-' + this.theProject.name
      this.planRules = {}
      this.planRules.geoResultDataLink = [
        { required: true, message: 'Geotechnical data is required', trigger: 'blur' }
      ]
      // let action = '指定岩土基础校对人'
      let action = '岩土方案提交校审'
      this.theProjectLog = {
        project_code: row.project_code,
        action: action,
        action_remark: '方案名称:' + row.plan_description,
        role: '岩土工程师',
        operator: this.name,
        to_person: '王浩然',
        to_id: row.id,
        content: ''
      }
      this.planDialogVisible = true  //显示对话框
    },
    //上部结构校核通过
    showDialogStruCheckerApprove(row) {
      this.theRoles = "structure_checker_pass"  //上部结构校对通过直接提交审批(与其它操作不同)
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.struCheckStatus = '2'  //将检查状态改为2-通过
      this.approveDialogTitle = '结构方案通过-' + this.theProject.name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '上部结构校核通过',
        action_remark: '方案名称:' + row.plan_description,
        role: '上部结构校核人',
        operator: this.name,
        to_person: row.designer,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },
    //上部结构校核驳回
    showDialogStruCheckerReject(row) {
      this.theRoles = ''
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.struCheckStatus = '0'  //将检查状态改为0-驳回
      this.approveDialogTitle = '结构方案驳回-' + this.theProject.name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '上部结构校核驳回',
        action_remark: '方案名称:' + row.plan_description,
        role: '上部结构校核人',
        operator: this.name,
        to_person: row.designer,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },
    // //岩土基础校核通过
    // showDialogGeoCheckerApprove(row) {
    //   this.theRoles = ''
    //   this.theProject = this.projectList.find((e) => e.code === row.project_code)
    //   this.thePlan = this.coverPlan(row)
    //   this.thePlan.geoCheckStatus = '2'  //将检查状态改为2-通过
    //   this.approveDialogTitle = '岩土基础通过-' + this.theProject.name + '-' + row.plan_description
    //   this.theProjectLog = {
    //     project_code: row.project_code,
    //     action: '岩土基础校核通过',
    //     action_remark: '方案名称:' + row.plan_description,
    //     role: '岩土基础校核人',
    //     operator: this.name,
    //     to_person: row.geotechnical,
    //     to_id: row.id,
    //     content: ''
    //   }
    //   this.approveDialogVisible = true  //显示审批对话框
    // },
    // //岩土基础校核驳回
    // showDialogGeoCheckerReject(row) {
    //   this.theRoles = ''
    //   this.theProject = this.projectList.find((e) => e.code === row.project_code)
    //   this.thePlan = this.coverPlan(row)
    //   this.thePlan.geoCheckStatus = '0'  //将检查状态改为0-驳回
    //   this.approveDialogTitle = '岩土基础驳回-' + this.theProject.name + '-' + row.plan_description
    //   this.theProjectLog = {
    //     project_code: row.project_code,
    //     action: '岩土基础校核驳回',
    //     action_remark: '方案名称:' + row.plan_description,
    //     role: '岩土基础校核人',
    //     operator: this.name,
    //     to_person: row.geotechnical,
    //     to_id: row.id,
    //     content: ''
    //   }
    //   this.approveDialogVisible = true  //显示审批对话框
    // },
    //结构和基础设计全部完成设计和校核，提交技术总监（不需要了，上部结构校对通过，直接到总监处审批）
    showDialogSubmitApprovePlan(row) {
      if(['0','1','2'].includes(row.geo_check_status)){
        alert('岩土设计尚未完成，无法提交')
        return
      }
      this.theRoles = ''
      this.theProject = this.projectList.find((e) => e.code === row.project_code)
      this.thePlan = this.coverPlan(row)
      this.thePlan.planStatus = '1'  //将方案状态改为1-设计完成，已在技术总监处等待审批
      this.approveDialogTitle = `提交【${this.theProject.technical_director}】审核-` + this.theProject.name + '-' + row.plan_description
      this.theProjectLog = {
        project_code: row.project_code,
        action: '提交技术主管审核',
        action_remark: '方案名称:' + row.plan_description,
        role: '结构工程师',
        operator: this.name,
        to_person: this.theProject.technical_director,
        to_id: row.id,
        content: ''
      }
      this.approveDialogVisible = true  //显示审批对话框
    },

    //删除方案
    removePlanById(row) {
      //有校核或审批记录的不能提交
      if (row.stru_check_status !== '1'
        && row.stru_check_status !== '2'
        && row.geo_check_status !== '1'
        && row.geo_check_status !== '2') {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // promise
          // 点击确定，远程调用ajax
          return apiPlan.removeById(row.id)
        }).then((response) => {
          this.fetchProjectData(this.page)
          this.$message.success(response.message || '删除成功')
        }).catch(() => {
          this.$message.info('取消删除')
        })
      } else {
        this.$message.error('无法删除已有校核或审批通过记录的方案,如需删除,请先联系校核或审批人驳回')
      }
    },

    //添加或更新
    saveOrUpdatePlan() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          if (!this.thePlan.id) {
            this.savePlan(this.thePlan)
          } else {
            this.updatePlan()
          }
        }
      })
    },

    //添加方案
    savePlan() {
      apiPlan.save(this.thePlan).then(response => {
        this.$message.success('操作成功')
        this.planDialogVisible = false
        this.fetchProjectData()
      })
      this.planRules = {}
    },
    //修改方案
    updatePlan() {
      this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
      if (this.theProjectLog.action.includes('指定') && this.theProjectLog.action.includes('岩土')) {
        this.theProjectLog.to_person = this.thePlan.geotechnical  //将指定的岩土工程师名字写入记录中
      }
      if (this.theProjectLog.action.includes('指定')
        && this.theProjectLog.action.includes('上部结构')
        && this.theProjectLog.action.includes('校对人')
      ) {
        this.theProjectLog.to_person = this.thePlan.struChecker //将指定上部结构校对人名字记录中
      }
      if (this.theProjectLog.action.includes('指定')
        && this.theProjectLog.action.includes('岩土基础')
        && this.theProjectLog.action.includes('校对人')
      ) {
        this.theProjectLog.to_person = this.thePlan.geoChecker //将指定上部结构校对人名字记录中
      }

      apiPlan.updateById(this.thePlan).then(response => {
        this.$message.success(response.message || '操作成功')
        this.updateCheckers()  //更新校对人员
        this.saveProjectLog(this.theProjectLog)//加一条项目日志
        setTimeout(() => {
          this.fetchProjectData()
        }, 1000)
      }).catch((reason) => {
        alert('错误原因：' + reason)
      })
      
      this.planDialogVisible = false
      this.planRules = {}
    },

    makeSureApprove() {
      //提交审批改为由结构校对人员操作，但岩土校对提交的校对通过，不能跳到技术总监处，所以结构校对操作为传入1，岩土校对操作时传入0（默认为0）
      if(this.theRoles === 'structure_checker_pass'){
        this.thePlan.planStatus = 1  //将方案状态改为1-设计完成，已在技术总监处等待审批
        this.theProjectLog.to_person = this.theProject.technical_director
      }
      this.theProjectLog.content = this.approveTextarea  //写入通过或驳回的意见
      //修改方案表中的相关状态(this.thePlan中已含有变化)
      apiPlan.updateById(this.thePlan).then(response => {
        this.$message.success(response.message || '操作成功')
        this.saveProjectLog(this.theProjectLog)//加一条项目日志
        this.fetchProjectData()
      }).catch((reason) => {
        alert('错误原因：' + reason)
      })
      this.approveDialogVisible = false
    },

    updateCheckers() {
      console.log('updateCheckers:', this.theProject)
      fetch(process.env.VUE_APP_BASE_API + '/api/updateCheckers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({
          project_code: this.theProject.code
        })
        
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {

          } else {
            // 如果响应状态码不是2xx，抛出错误
            this.updateCheckers()
            throw new Error('Something went wrong on server side.')
          }
        })
    },

    //添加项目日志
    saveProjectLog(logObj) {
      fetch(process.env.VUE_APP_BASE_API + '/api/saveProjectLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify(logObj)
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            this.approveTextarea = ''//将意见文本框内容清空

          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
    },


    //添加或更新
    formatDataLink(row, column, cellValue, index) {
      let link = ''
      if (cellValue !== undefined && cellValue !== null && cellValue.slice(0, 4) === 'http') {
        link = cellValue.slice(0, 5) + '...'
      }
      return link
    },
    formatCheckStatusStru(row, column, cellValue, index) {
      if(typeof cellValue === 'string'){
        if (cellValue === '0') {
          return '结构设计中'
        }
        if (cellValue === '1') {
          return '结构校审中'
        }
        if (cellValue === '2') {
          return '结构已完成'
        }
      } else {
        return cellValue
      }
    },
    formatCheckStatusGeo(row, column, cellValue, index) {
      if(typeof cellValue === 'string'){
        if (cellValue === '0') {
          return '岩土待指派'
        }
        if (cellValue === '1') {
          return '岩土设计中'
        }
        if (cellValue === '2') {
          return '岩土校审中'
        }
        if (cellValue === '3') {
          return '岩土已完成'
        }
      } else {
        return cellValue
      }
    },

    coverPlan(obj) {
      let r = {
        id: obj.id,
        planCode: obj.plan_code,
        projectCode: obj.project_code,
        planDescription: obj.plan_description,
        category: obj.category,
        planStatus: obj.plan_status,
        projectDesignVersion: obj.project_design_version,
        designer: obj.designer,
        struResultDataLink: obj.stru_result_data_link,
        struChecker: obj.stru_checker,
        struCheckStatus: obj.stru_check_status,
        trackerInfoNum: obj.tracker_info_num,
        adjustPriceMsg: obj.adjust_price_msg,
        geotechnical: obj.geotechnical,
        dataLinkToGeotechnical: obj.data_link_to_geotechnical,
        geoRequiredCompletionTime: obj.geo_required_completion_time,
        geoResultDataLink: obj.geo_result_data_link,
        geoChecker: obj.geo_checker,
        geoCheckStatus: obj.geo_check_status
      }
      return r
    },

    /**
     * 最后保存时间：与 filterLocalTime 同一时间基准。
     * 文案：0 天不显示「0天」；0 天且 0 小时时只显示「X分钟前」；不足 5 分钟红色，否则蓝色。
     */
    getUpdateTimeAgoParts(value) {
      const past = parsePlanServerTimeMs(value)
      if (past === null) return { text: '', color: '' }
      let diff = Date.now() - past
      if (diff < 0) diff = 0
      const fiveMinMs = 5 * 60 * 1000
      const color = diff < fiveMinMs ? '#F56C6C' : '#409EFF'

      let d = diff
      const days = Math.floor(d / 86400000)
      d %= 86400000
      const hours = Math.floor(d / 3600000)
      d %= 3600000
      const minutes = Math.floor(d / 60000)

      let text = ''
      if (days > 0) {
        text = `${days}天${hours}小时${minutes}分钟前`
      } else if (hours > 0) {
        text = `${hours}小时${minutes}分钟前`
      } else {
        text = `${minutes}分钟前`
      }
      return { text, color }
    }

  },

  filters: {
    filterLink(str, n) {
      if (typeof str !== 'string') {
        return undefined
      } else {
        if (str.trim().slice(0, 4) === 'http') {
          return str.slice(0, n)
        } else {
          return undefined
        }
      }
    },

    filterGeotechnical(value,status) {
      if(status !== null && status.trim() !== ''){
        return "已申请"
      }
      return "未申请"
    },
    filterChecker(value) {
      if (typeof value !== 'string') {
        return '点击提交校对'
      } else {
        if (value.length < 1) {
          return '点击提交校对'
        } else {
          return value
        }
      }
    },
    filterPlanStatus(value) {
      if (value === '0') {
        return '设计中'
      } else if (value === '1') {
        return '技术总监审核中'
      } else if (value === '1a') {
        return '报价部门审查'
      } else if (value === '2') {
        return '设计完成'
      } else {
        return value
      }
    },
    filterDesignVersion(value) {
      if (value === 0) {
        return '初始版'
      } else {
        return '第'+value+'版'
      }
    },
    // 后端时间为 UTC 语义时，减 8 小时与本地（东八区）展示一致
    filterLocalTime(value) {
      const t = parsePlanServerTimeMs(value)
      if (t === null) return ''
      return myUtils.getDateToString(new Date(t))
    }
  },
  mounted() {
    this.fetchProjectData()
    this.getAllTechnicalEngineers()
  }
}
</script>

<style scoped>
#app-container {
  padding: 10px;
}

.badges {
  display: flex;
}

.badges div {
  margin: 10px;
}

.container {
  font-weight: bold;
}

h2:hover {
  cursor: pointer;
}

::v-deep .el-collapse-item__header {
  background-color: #f5f5f5;
  color: #333;
  font-size: 16px;
}

.link-item {
  font-size: 12px;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #409EFF;
}
.el-drawer.rtl{
  overflow-y: scroll;
}

</style>
