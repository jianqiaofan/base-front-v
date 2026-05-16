<template>
  <div class="tb-seller-tool">
    <el-button type="primary" icon="el-icon-tickets" @click="quotationDrawerVisible = true">
      打开报价单
    </el-button>

    <div class="form-div">
      <el-form ref="quotationForm" :model="q" label-width="160px" size="small" label-position="right">
        <el-collapse v-model="activeCollapse">
          <!-- 顶层字段 -->
          <el-collapse-item title="基本信息" name="base">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="seller"><el-input v-model="q.seller" clearable /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="seller_mail"><el-input v-model="q.seller_mail" clearable /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="project_code"><el-input v-model="q.project_code" clearable /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="project_name"><el-input v-model="q.project_name" clearable /></el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="director_remark"><el-input v-model="q.director_remark" type="textarea" :rows="2" /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="quotation_date"><el-input v-model="q.quotation_date" clearable /></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="quotation_valid_until"><el-input v-model="q.quotation_valid_until" clearable /></el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="project_info" name="project_info">
            <el-row :gutter="16">
              <el-col :span="12"><el-form-item label="project"><el-input v-model="q.project_info.project" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="customer"><el-input v-model="q.project_info.customer" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="MWDc"><el-input-number v-model="q.project_info.MWDc" :controls="true" :step="0.001" style="width:100%" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="attention"><el-input v-model="q.project_info.attention" /></el-form-item></el-col>
              <el-col :span="24"><el-form-item label="location"><el-input v-model="q.project_info.location" type="textarea" :rows="2" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="refNo"><el-input v-model="q.project_info.refNo" /></el-form-item></el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="proposed_tracker_solution" name="pts">
            <el-form-item label="product"><el-input v-model="q.proposed_tracker_solution.product" type="textarea" :rows="2" /></el-form-item>
            <el-form-item label="drive_system"><el-input v-model="q.proposed_tracker_solution.drive_system" type="textarea" :rows="2" /></el-form-item>
            <el-form-item label="control_communication"><el-input v-model="q.proposed_tracker_solution.control_communication" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="power_source"><el-input v-model="q.proposed_tracker_solution.power_source" /></el-form-item>
            <el-form-item label="design_wind_speed"><el-input v-model="q.proposed_tracker_solution.design_wind_speed" /></el-form-item>
            <el-form-item label="corrosion_protection"><el-input v-model="q.proposed_tracker_solution.corrosion_protection" type="textarea" :rows="4" /></el-form-item>
            <el-form-item label="post_type_embedments_depth"><el-input v-model="q.proposed_tracker_solution.post_type_embedments_depth" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="module_power"><el-input v-model="q.proposed_tracker_solution.module_power" /></el-form-item>
            <el-form-item label="module_no_strings"><el-input v-model="q.proposed_tracker_solution.module_no_strings" /></el-form-item>
            <el-form-item label="operation_features"><el-input v-model="q.proposed_tracker_solution.operation_features" type="textarea" :rows="4" /></el-form-item>
            <el-form-item label="slope_available"><el-input v-model="q.proposed_tracker_solution.slope_available" type="textarea" :rows="2" /></el-form-item>
            <el-form-item label="rotation_features"><el-input v-model="q.proposed_tracker_solution.rotation_features" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="design"><el-input v-model="q.proposed_tracker_solution.design" type="textarea" :rows="3" /></el-form-item>
          </el-collapse-item>

          <el-collapse-item title="price_and_payment_terms" name="price">
            <el-form-item label="item"><el-input v-model="q.price_and_payment_terms.item" type="textarea" :rows="5" /></el-form-item>
            <el-row :gutter="16">
              <el-col :span="12"><el-form-item label="design_capacity"><el-input-number v-model="q.price_and_payment_terms.design_capacity" :step="0.01" style="width:100%" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="description"><el-input v-model="q.price_and_payment_terms.description" /></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="FOB"><el-input v-model="q.price_and_payment_terms.FOB" /></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="CIF"><el-input v-model="q.price_and_payment_terms.CIF" /></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="CIF_total"><el-input-number v-model="q.price_and_payment_terms.CIF_total" style="width:100%" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="on_site_engineer"><el-input-number v-model="q.price_and_payment_terms.on_site_engineer" style="width:100%" /></el-form-item></el-col>
              <el-col :span="12"><el-form-item label="on_site_engineer_included"><el-switch v-model="q.price_and_payment_terms.on_site_engineer_included" /></el-form-item></el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="delivery_warranty" name="delivery">
            <el-form-item label="incoterms_2010"><el-input v-model="q.delivery_warranty.incoterms_2010" /></el-form-item>
            <el-form-item label="port_of_departure"><el-input v-model="q.delivery_warranty.port_of_departure" /></el-form-item>
            <el-form-item label="no_of_containers"><el-input v-model="q.delivery_warranty.no_of_containers" /></el-form-item>
            <el-form-item label="first_delivery_lead_time"><el-input v-model="q.delivery_warranty.first_delivery_lead_time" /></el-form-item>
            <el-form-item label="estimated_delivery_rate"><el-input v-model="q.delivery_warranty.estimated_delivery_rate" /></el-form-item>
            <el-form-item label="steel_structural_components"><el-input v-model="q.delivery_warranty.steel_structural_components" /></el-form-item>
            <el-form-item label="electro_mechanical_components"><el-input v-model="q.delivery_warranty.electro_mechanical_components" /></el-form-item>
            <el-form-item label="galvanizing_protection"><el-input v-model="q.delivery_warranty.galvanizing_protection" /></el-form-item>
          </el-collapse-item>

          <el-collapse-item title="construction_spare_parts" name="spare">
            <div v-for="row in constructionSpareRows" :key="row.key" class="tb-seller-tool__spare-row">
              <span class="tb-seller-tool__spare-label">{{ row.label }}</span>
              <el-input-number v-model="q.construction_spare_parts[row.key].percentage" :min="0" :max="100" :step="0.1" size="small" controls-position="right" />
              <span class="tb-seller-tool__spare-unit">%</span>
              <el-switch v-model="q.construction_spare_parts[row.key].price" active-text="price" />
            </div>
          </el-collapse-item>

          <el-collapse-item title="tracker_supply (es/cs/op: 1/0)" name="tracker">
            <el-table :data="q.tracker_supply" border size="small" style="width:100%">
              <el-table-column prop="id" label="id" width="60" />
              <el-table-column label="ESET (es)">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.es" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column label="Customer (cs)">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.cs" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column label="Optional (op)">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.op" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="Service (es/cs/op)" name="service">
            <el-table :data="q.Service" border size="small" style="width:100%">
              <el-table-column prop="id" label="id" width="60" />
              <el-table-column label="ESET (es)">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.es" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column label="Customer (cs)">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.cs" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column label="Optional (op)">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.op" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="其它" name="extra">
            <el-form-item label="service_extra_onsite_engineer_price">
              <el-input-number v-model="q.service_extra_onsite_engineer_price" :min="0" style="width:240px" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>

    <el-drawer
      title="报价单"
      :visible.sync="quotationDrawerVisible"
      direction="btt"
      size="90%"
      append-to-body
      :destroy-on-close="false"
      custom-class="tb-seller-tool__quotation-drawer"
    >
      <seller-tool-quotation :quotation-parent="q" />
    </el-drawer>
  </div>
</template>

<script>
import { Quotation } from '@/views/pages/eset/trackers2/utils/classQuotation'
import SellerToolQuotation from './components/SellerTool/SellerToolQuotation.vue'

export default {
  name: 'TbSellerTool',
  components: {
    SellerToolQuotation,
  },
  data() {
    return {
      quotationDrawerVisible: false,
      q: new Quotation(),
      activeCollapse: ['base'],
      constructionSpareRows: [
        { key: 'fasteners_spares', label: 'fasteners_spares' },
        { key: 'up_structure_damper', label: 'up_structure_damper' },
        { key: 'control_box_tcu', label: 'control_box_tcu' },
        { key: 'post_others', label: 'post_others' },
        { key: 'slew_drive_motor', label: 'slew_drive_motor' },
        { key: 'communication_box_ncu', label: 'communication_box_ncu' },
      ],
    }
  },
}
</script>

<style scoped>
.tb-seller-tool {
  padding: 12px;
}

.form-div {
  margin-top: 16px;
  padding: 16px;
  max-height: min(70vh, 900px);
  overflow: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fafafa;
}

.tb-seller-tool__spare-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tb-seller-tool__spare-label {
  width: 200px;
  font-size: 13px;
  color: #606266;
}

.tb-seller-tool__spare-unit {
  font-size: 13px;
  color: #909399;
}
</style>

<style lang="scss">
.tb-seller-tool__quotation-drawer .el-drawer__body {
  padding: 0 16px 16px;
  overflow: auto;
  height: calc(100% - 55px);
  box-sizing: border-box;
}
</style>
