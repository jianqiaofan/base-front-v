<template>
  <div id="container" class="scrollable-div">
    <div style="margin-left: 20px">
      <el-row>
        <el-button :type="buttonType" @click="editStatus">{{ buttonText }}</el-button>
        <el-button type="primary" :disabled="editable" @click="pdfBtn">导出PDF</el-button>
        <el-button type="primary" :disabled="editable" @click="pdfEachBtn">单页导出</el-button>
        <span style="font-size: 12px;color: #af9800;margin-left: 20px"
        >如需生成高清PDF，请放大浏览器缩放比例(按下ctrl键不放，并向上滚动鼠标滚轮)</span>
      </el-row>
    </div>

    <div id="pdfScope" style="width: 900px">
      <!--page1 Cover & Letter==============================-->
      <div id="PdfPage1" class="page page1">
        <div style="background-color: #e0d8d2;width: 94%;margin-left: 20px;text-align: left">
          <img src="../../../../assets/logo_images/esetlogo.png" height="30px" alt="ESETLog"
               style="margin-top: 10px;margin-left: 10px"
          />
          <img src="../../../../assets/logo_images/cover_img.jpg"
               style="width:100%" alt="ESETLog"
          />
          <h3 v-if="editable" style="text-align: center">
            <el-input v-model="quotation.project_name" placeholder="请输入项目名称"
                      style="width:600px;"
            ></el-input>
          </h3>
          <h3 v-else style="text-align: center">{{ quotation.project_name }}</h3>
        </div>
        <br>
        <br>
        <br>
        <table style="width: 94%;margin-left: 20px">
          <tbody>
          <tr>
            <td style="width:270px"></td>
            <td>Quotation data</td>
            <td v-if="editable">
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  v-model="quotation.quotation_date"
                  type="date"
                  value-format="MM-dd-yyyy"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </div>
            </td>
            <td v-if="!editable">{{ quotation.quotation_date }}</td>

          </tr>
          <tr>
            <td style="width:270px"></td>
            <td>Quotation valid until</td>
            <td v-if="editable">
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  v-model="quotation.quotation_valid_until"
                  type="date"
                  value-format="MM-dd-yyyy"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </div>
            </td>
            <td v-if="!editable">{{ quotation.quotation_valid_until }}</td>
          </tr>

          <tr>
            <td style="width:270px"></td>
            <td>nick name</td>
            <td v-if="editable">
              <el-input v-model="quotation.sellerMmail" placeholder="请输入邮箱" style="width: 220px"></el-input>
            </td>
            <td v-if="!editable">nick name@jseset.com</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right"><span style="font-weight: bold;font-style: italic;">Jiangsu EverShine Energy Technology Co., Ltd.</span>
            </td>
          </tr>
          <tr style="height:40px">
            <td colspan="3" style="text-align:right"></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:left;font-size: 14px">This proposed technical solution and commercial
              offer
              has been prepared for the suply of ESEEK solar tracker with a total peak power of 40 MWdc, based on 625 Wp
              Bifacial module.
            </td>
          </tr>
          <tr style="height:10px">
            <td colspan="3" style="text-align:right"></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:left;font-size: 14px">ESEEK solar tracker adopts Slew drive, which can
              have
              flexible design avaliable, good adaptability for complex terrain, and the innovation of octagonal tube,
              Provide better bending and torsional capabilities with minimum material. ESET team will fully assist JET
              from product design, production, transportation, on-site guidance for installation and commissioning to
              ensure the success of the project.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--page2  Detail Quotation==============================-->
      <div id="PdfPage2" class="page page2">
        <div style="background-color: #e0d8d2;width: 96%;margin-left: 2%; text-align: left">
          <div style="text-align: left">
            <img src="../../../../assets/logo_images/esetlogo.png" height="10px" alt="ESETLog"
                 style="margin-top: 10px;margin-left: 10px"
            />
          </div>
          
          <!--1 Project Info==============================-->
          <div class="table1">
            <span class="catalog">1 Project Info</span>
            <hr>
            <table v-if="!editable">
              <tr>
                <td style="width:20px"></td>
                <td style="width:40px">Project:</td>
                <td style="width:400px">{{ quotation.project_info.project }}</td>
                <td style="width:40px">Customer:</td>
                <td style="width:200px">{{ quotation.project_info.customer }}</td>
              </tr>
              <tr>
                <td></td>
                <td>MWDc:</td>
                <td>{{ quotation.project_info.MWDc }}</td>
                <td>Attention:</td>
                <td>{{ quotation.project_info.attention }}</td>
              </tr>
              <tr>
                <td></td>
                <td>Location:</td>
                <td>{{ quotation.project_info.location }}</td>
                <td>REF. No.:</td>
                <td>{{ quotation.project_info.refNo }}</td>
              </tr>
            </table>
            <table v-if="editable">
              <tr>
                <td style="width:20px"></td>
                <td style="width:40px">Project:</td>
                <td style="width:400px">
                  <input type="text" v-model="quotation.project_info.project" style="width: 200px">
                </td>
                <td style="width:40px">Customer:</td>
                <td style="width:200px"><input type="text" v-model="quotation.project_info.customer"
                                               style="width: 200px"
                ></td>
              </tr>
              <tr>
                <td></td>
                <td>MWDc:</td>
                <td><input type="text" v-model="quotation.project_info.MWDc" style="width: 200px"></td>
                <td>Attention:</td>
                <td><input type="text" v-model="quotation.project_info.attention" style="width: 200px"></td>
              </tr>
              <tr>
                <td></td>
                <td>Location:</td>
                <td><input type="text" v-model="quotation.project_info.location" style="width: 200px"></td>
                <td>REF. No.:</td>
                <td><input type="text" v-model="quotation.project_info.refNo" style="width: 200px"></td>
              </tr>
            </table>

          </div>

          <!--2 Proposed Tracker Solution==============================-->
          <div class="table2">
            <span class="catalog">2 Proposed Tracker Solution</span>
            <hr>
            <table v-if="editable">
              <tr>
                <td style="width:180px"></td>
                <td style="width:100px">Product:</td>
                <td style="width:240px"><input type="text" v-model="quotation.proposed_tracker_solution.product"
                                               style="width: 200px"
                ></td>
                <td style="width:100px">Module power:</td>
                <td><input type="text" v-model="quotation.proposed_tracker_solution.module_power" style="width: 200px">
                </td>
              </tr>

              <tr>
                <td></td>
                <td>Drive system:</td>
                <td><input type="text" v-model="quotation.proposed_tracker_solution.drive_system" style="width: 200px">
                </td>
                <td>Module No. / Strings</td>
                <td><input type="text" v-model="quotation.proposed_tracker_solution.module_no_strings"
                           style="width: 200px"
                ></td>
              </tr>

              <tr>
                <td></td>
                <td>Control & Communication:</td>
                <td><textarea cols="46" rows="5" v-model="quotation.proposed_tracker_solution.control_communication"
                ></textarea></td>
                <td>Operation Features:</td>
                <td><textarea cols="46" rows="5" v-model="quotation.proposed_tracker_solution.operation_features"
                ></textarea></td>
              </tr>

              <tr>
                <td></td>
                <td>Power Source:</td>
                <td><input type="text" v-model="quotation.proposed_tracker_solution.power_source" style="width: 200px">
                </td>
                <td>Slope available:</td>
                <td><input type="text" v-model="quotation.proposed_tracker_solution.slope_available"
                           style="width: 200px"
                ></td>
              </tr>

              <tr>
                <td></td>
                <td>Design Wind speed:</td>
                <td><input type="text" v-model="quotation.proposed_tracker_solution.design_wind_speed"
                           style="width: 200px"
                ></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td>Corrosion protection:</td>
                <td><textarea cols="46" rows="3" v-model="quotation.proposed_tracker_solution.corrosion_protection"
                ></textarea></td>
                <td>Rotation Features:</td>
                <td><textarea cols="46" rows="3" v-model="quotation.proposed_tracker_solution.rotation_features"
                ></textarea></td>
              </tr>

              <tr>
                <td></td>
                <td>Post type & Embedments Depth:</td>
                <td><textarea cols="46" rows="3"
                              v-model="quotation.proposed_tracker_solution.post_type_embedments_depth"
                ></textarea></td>
                <td>Design:</td>
                <td><textarea cols="46" rows="3" v-model="quotation.proposed_tracker_solution.design"></textarea></td>
                >
              </tr>
            </table>

            <table v-if="!editable">
              <tr>
                <td style="width:180px"></td>
                <td style="width:100px">Product:</td>
                <td style="width:240px">{{ quotation.proposed_tracker_solution.product }}</td>
                <td style="width:100px">Module power:</td>
                <td>{{ quotation.proposed_tracker_solution.module_power }}</td>
              </tr>

              <tr>
                <td></td>
                <td>Drive system:</td>
                <td>{{ quotation.proposed_tracker_solution.drive_system }}</td>
                <td>Module No. / Strings</td>
                <td>{{ quotation.proposed_tracker_solution.module_no_strings }}</td>
              </tr>

              <tr>
                <td></td>
                <td>Control & Communication:</td>
                <td>{{ quotation.proposed_tracker_solution.control_communication }}</td>
                <td>Operation Features:</td>
                <td>{{ quotation.proposed_tracker_solution.operation_features }}</td>
              </tr>

              <tr>
                <td></td>
                <td>Power Source:</td>
                <td>{{ quotation.proposed_tracker_solution.power_source }}</td>
                <td>Slope available:</td>
                <td>{{ quotation.proposed_tracker_solution.slope_available }}</td>
              </tr>

              <tr>
                <td></td>
                <td>Design Wind speed:</td>
                <td>{{ quotation.proposed_tracker_solution.design_wind_speed }}</td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td></td>
                <td>Corrosion protection:</td>
                <td>{{ quotation.proposed_tracker_solution.corrosion_protection }}
                </td>
                <td>Rotation Features:</td>
                <td>{{ quotation.proposed_tracker_solution.rotation_features }}</td>
              </tr>

              <tr>
                <td></td>
                <td>Post type & Embedments Depth:</td>
                <td>{{ quotation.proposed_tracker_solution.post_type_embedments_depth }}</td>
                <td>Design:</td>
                <td>{{ quotation.proposed_tracker_solution.design }}</td>
                >
              </tr>
            </table>

            <div style="background-color: #dbe9f5">
              <table>
                <tr>
                  <td style="text-align: center;width: 100px"><span class="note">Note:</span></td>
                  <td><span class="note">The final design is related to the confirmation of module, layout and foundation design and other parameters, any change in these parameters may lead to a revision of the design and price.</span>
                  </td>
                </tr>
              </table>

            </div>
          </div>

          <!--3 Price and Payment Terms==============================-->
          <div class="table3">
            <span class="catalog">3 Price and Payment Terms</span>
            <hr>
            <table v-if="editable">
              <thead>
              <tr>
                <td style="width: 240px;text-align: center">Item</td>
                <td style="width: 180px;text-align: center">Design Capacity<br>（MW）</td>
                <td style="width: 180px;text-align: center">Description</td>
                <td style="width: 180px;text-align: center">USD / Wp<br>FOB Qingdao</td>
                <td style="width: 180px;text-align: center">USD / Wp<br>CIF Casablanca</td>
                <td style="width: 180px;text-align: center">Total Amount/USD<br>CIF Casablanca</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td style="text-align: center"><textarea cols="50" rows="6"
                                                         v-model="quotation.price_and_payment_terms.item"
                ></textarea></td>
                <td style="text-align: center"><input type="text"
                                                      v-model="quotation.price_and_payment_terms.design_capacity"
                                                      style="width: 80%"
                ></td>
                <td style="text-align: center"><input type="text"
                                                      v-model="quotation.price_and_payment_terms.description"
                                                      style="width: 80%"
                ></td>
                <td style="text-align: center"><input type="text" v-model="quotation.price_and_payment_terms.FOB"
                                                      style="width: 80%"
                ></td>
                <td style="text-align: center"><input type="text" v-model="quotation.price_and_payment_terms.CIF"
                                                      style="width: 80%"
                ></td>
                <td style="text-align: center"><input type="text" v-model="quotation.price_and_payment_terms.CIF_total"
                                                      style="width: 80%"
                ></td>
              </tr>
              <tr>
                <td colspan="5" style="text-align: center">On site engineer service <input type="text"
                                                                                           v-model="quotation.price_and_payment_terms.on_site_engineer"
                                                                                           style="width: 20px"
                > man*days
                </td>
                <td style="text-align: center">
                  {{ quotation.price_and_payment_terms.on_site_engineer_included ? 'Included' : '' }}
                </td>
              </tr>
              </tbody>
            </table>
            <table v-if="!editable">
              <thead>
              <tr>
                <td style="width: 240px;text-align: center">Item</td>
                <td style="width: 180px;text-align: center">Design Capacity<br>（MW）</td>
                <td style="width: 180px;text-align: center">Description</td>
                <td style="width: 180px;text-align: center">USD / Wp<br>FOB Qingdao</td>
                <td style="width: 180px;text-align: center">USD / Wp<br>CIF Casablanca</td>
                <td style="width: 180px;text-align: center">Total Amount/USD<br>CIF Casablanca</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td style="text-align: center">{{ quotation.price_and_payment_terms.item }}
                </td>
                <td style="text-align: center">{{ quotation.price_and_payment_terms.design_capacity }}</td>
                <td style="text-align: center">{{ quotation.price_and_payment_terms.description }}</td>
                <td style="text-align: center">{{ quotation.price_and_payment_terms.FOB }}</td>
                <td style="text-align: center">{{ quotation.price_and_payment_terms.CIF }}</td>
                <td style="text-align: center">{{ quotation.price_and_payment_terms.CIF_total }}</td>
              </tr>
              <tr>
                <td colspan="5" style="text-align: center">On site engineer service
                  {{ quotation.price_and_payment_terms.on_site_engineer }} man*days
                </td>
                <td style="text-align: center">
                  {{ quotation.price_and_payment_terms.on_site_engineer_included ? 'Included' : '' }}
                </td>
              </tr>
              </tbody>
            </table>
            <div style="background-color: #dbe9f5">
              <table>
                <tr>
                  <td style="text-align: center;width: 100px"><span class="note">Payment Term:</span></td>
                  <td><span class="note">By negotiation</span></td>
                </tr>
              </table>
            </div>
            <div style="height:6px;"></div>
            <div style="background-color: #dbe9f5">
              <table>
                <tr>
                  <td rowspan="3" style="text-align: center;width: 100px"><span class="note">Note:</span></td>
                  <td><span class="note"
                  >1) Number of exterior and interior tracker subject to the final layout design;</span></td>
                </tr>
                <tr>
                  <td>
                    <span class="note">2) The length of the post and Embedded Post Depth have been calculated on the basis of the geotechnical report received, it may changed after POT result and caculation;</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="note">3) The Logistics cost in this offer are estimated at the date of the offer. The final cost of the Logistics will be subjected to the real cost upon contract execution.</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <!--4 Delivery and Warranty==============================-->
          <div class="table4">
            <span class="catalog">4 Delivery and Warranty</span>
            <hr>
            <table v-if="editable">
              <tr>
                <td style="width:700px">
                  <table>
                    <tr>
                      <td style="text-align: left;width: 200px">Incoterms 2010:</td>
                      <td style="text-align: left"><input type="text"
                                                          v-model="quotation.delivery_warranty.incoterms_2010"
                                                          style="width: 150px"
                      ></td>
                    </tr>
                    <tr>
                      <td>Port of Departure:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.port_of_departure"
                                 style="width: 150px"
                      ></td>
                    </tr>
                    <tr>
                      <td>No. of Containers:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.no_of_containers"
                                 style="width: 150px"
                      ></td>
                    </tr>
                    <tr>
                      <td>1st Delivery lead time:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.first_delivery_lead_time"
                                 style="width: 150px"
                      ></td>
                    </tr>
                    <tr>
                      <td>Estimated Delivery rate:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.estimated_delivery_rate"
                                 style="width: 150px"
                      ></td>
                    </tr>
                  </table>
                </td>
                <td style="width:500px">
                  <table>
                    <tr>
                      <td colspan="2" style="text-align: left;">
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
                      <td style="width: 200px">Steel structural components:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.steel_structural_components"
                                 style="width: 150px"
                      ></td>
                    </tr>
                    <tr>
                      <td>Electro & Mechanical components:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.electro_mechanical_components"
                                 style="width: 150px"
                      ></td>
                    </tr>
                    <tr>
                      <td>Galvanizing protection:</td>
                      <td><input type="text" v-model="quotation.delivery_warranty.galvanizing_protection"
                                 style="width: 150px"
                      ></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table v-if="!editable">
              <tr>
                <td style="width:700px">
                  <table>
                    <tr>
                      <td style="text-align: left;width: 200px">Incoterms 2010:fdsa</td>
                      <td style="text-align: left">{{ quotation.delivery_warranty.incoterms_2010 }}</td>
                    </tr>
                    <tr>
                      <td>Port of Departure:</td>
                      <td>{{ quotation.delivery_warranty.port_of_departure }}</td>
                    </tr>
                    <tr>
                      <td>No. of Containers:</td>
                      <td>{{ quotation.delivery_warranty.no_of_containers }}</td>
                    </tr>
                    <tr>
                      <td>1st Delivery lead time:</td>
                      <td>{{ quotation.delivery_warranty.first_delivery_lead_time }}</td>
                    </tr>
                    <tr>
                      <td>Estimated Delivery rate:</td>
                      <td>{{ quotation.delivery_warranty.estimated_delivery_rate }}</td>
                    </tr>
                  </table>
                </td>
                <td style="width:500px">
                  <table>
                    <tr>
                      <td colspan="2" style="text-align: left;">
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
                      <td style="width: 200px">Steel structural components:</td>
                      <td>10 years</td>
                    </tr>
                    <tr>
                      <td>Electro & Mechanical components:</td>
                      <td>{{ quotation.delivery_warranty.electro_mechanical_components }}</td>
                    </tr>
                    <tr>
                      <td>Galvanizing protection:</td>
                      <td>{{ quotation.delivery_warranty.galvanizing_protection }}</td>
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
            <table v-if="editable">
              <tr>
                <td style="width:600px">
                  <table>
                    <thead>
                    <tr>
                      <td style="width: 300px;text-align:left">Construction spares parts</td>
                      <td style="width: 200px">Percentage</td>
                      <td style="width: 200px">Price</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Fasteners spares</td>
                      <td><input type="text" v-model="quotation.construction_spare_parts.fasteners_spares.percentage"
                                 style="width: 50px"
                      >%
                      </td>
                      <td><input type="checkbox" v-model="quotation.construction_spare_parts.fasteners_spares.price">
                      </td>
                    </tr>
                    <tr>
                      <td>Up Structure & Damper</td>
                      <td><input type="text" v-model="quotation.construction_spare_parts.up_structure_damper.percentage"
                                 style="width: 50px"
                      >%
                      </td>
                      <td><input type="checkbox" v-model="quotation.construction_spare_parts.up_structure_damper.price">
                      </td>
                    </tr>
                    <tr>
                      <td>Control Box (TCU)</td>
                      <td><input type="text" v-model="quotation.construction_spare_parts.control_box_tcu.percentage"
                                 style="width: 50px"
                      >%
                      </td>
                      <td><input type="checkbox" v-model="quotation.construction_spare_parts.control_box_tcu.price">
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width:500px">
                  <table>
                    <thead>
                    <tr>
                      <td style="width: 300px;text-align:left">Construction spares parts</td>
                      <td style="width: 200px">Percentage</td>
                      <td style="width: 200px">Price</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Post & others</td>
                      <td><input type="text" v-model="quotation.construction_spare_parts.post_others.percentage"
                                 style="width: 50px"
                      >%
                      </td>
                      <td><input type="checkbox" v-model="quotation.construction_spare_parts.post_others.price"></td>
                    </tr>
                    <tr>
                      <td>Slew drive & Motor</td>
                      <td><input type="text" v-model="quotation.construction_spare_parts.slew_drive_motor.percentage"
                                 style="width: 50px"
                      >%
                      </td>
                      <td><input type="checkbox" v-model="quotation.construction_spare_parts.slew_drive_motor.price">
                      </td>
                    </tr>
                    <tr>
                      <td>Communication Box (NCU)</td>
                      <td><input type="text"
                                 v-model="quotation.construction_spare_parts.communication_box_ncu.percentage"
                                 style="width: 50px"
                      >%
                      </td>
                      <td><input type="checkbox"
                                 v-model="quotation.construction_spare_parts.communication_box_ncu.price"
                      ></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
            <table v-if="!editable">
              <tr>
                <td style="width:600px">
                  <table>
                    <thead>
                    <tr>
                      <td style="width: 300px;text-align:left">Construction spares parts</td>
                      <td style="width: 200px">Percentage</td>
                      <td style="width: 200px">Price</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Fasteners spares</td>
                      <td>{{ quotation.construction_spare_parts.fasteners_spares.percentage }}%</td>
                      <td>
                        {{ quotation.construction_spare_parts.fasteners_spares.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    <tr>
                      <td>Up Structure & Damper</td>
                      <td>{{ quotation.construction_spare_parts.up_structure_damper.percentage }}%</td>
                      <td>
                        {{ quotation.construction_spare_parts.up_structure_damper.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    <tr>
                      <td>Control Box (TCU)</td>
                      <td>{{ quotation.construction_spare_parts.control_box_tcu.percentage }}%</td>
                      <td>{{ quotation.construction_spare_parts.control_box_tcu.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width:500px">
                  <table>
                    <thead>
                    <tr>
                      <td style="width: 300px;text-align:left">Construction spares parts</td>
                      <td style="width: 200px">Percentage</td>
                      <td style="width: 200px">Price</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Post & others</td>
                      <td>{{ quotation.construction_spare_parts.post_others.percentage }}%</td>
                      <td>{{ quotation.construction_spare_parts.post_others.price ? 'included' : 'not included' }}</td>
                    </tr>
                    <tr>
                      <td>Slew drive & Motor</td>
                      <td>{{ quotation.construction_spare_parts.slew_drive_motor.percentage }}%</td>
                      <td>
                        {{ quotation.construction_spare_parts.slew_drive_motor.price ? 'included' : 'not included' }}
                      </td>
                    </tr>
                    <tr>
                      <td>Communication Box (NCU)</td>
                      <td>{{ quotation.construction_spare_parts.communication_box_ncu.percentage }}%</td>
                      <td>
                        {{
                          quotation.construction_spare_parts.communication_box_ncu.price ? 'included' : 'not included'
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
      <!--page3 Scope of Work==============================-->
      <div id="PdfPage3" class="page page3">
        <h3 style="font-size: 20px;color:#00afee; text-align: left;padding-left:20px;padding-top:10px">Please check and
          confirm the responsibility for scope of the supplies.</h3>
        <div style="background-color: #e0d8d2;width: 96%;margin-left: 2%; text-align: left">
          <div style="text-align: right">
            <img src="../../../../assets/logo_images/esetlogo.png" height="20px" alt="ESETLog"
                 style="margin-top: 10px;margin-right: 20px"
            />
          </div>

          <h3>Annexure 1 Scope of Supply & Service</h3>
          <!--        table1-->
          <div style="text-align: center;background-color: #d7dff0">
            <h3>Tracker Supply</h3>
            <table style="width: 100%">
              <thead>
              <tr>
                <td style="width: 3%">No.</td>
                <td style="">Item</td>
                <td style="width: 12%">ESET Scope</td>
                <td style="width: 12%">Customer<br>Scope</td>
                <td style="width: 12%">Optional</td>
              </tr>
              </thead>
              <tbody>
              <tr v-if="editable" v-for="item in quotation.tracker_supply" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.item }}</td>
                <td style="text-align: center"><input type="checkbox" v-model="item.es"></td>
                <td style="text-align: center"><input type="checkbox" v-model="item.cs"></td>
                <td style="text-align: center"><input type="checkbox" v-model="item.op"></td>
              </tr>

              <tr v-if="!editable" v-for="item in quotation.tracker_supply" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ tracker_supply_item[item.id] }}</td>
                <td style="text-align: center">{{ item.es|filterChecked }}</td>
                <td style="text-align: center">{{ item.cs|filterChecked }}</td>
                <td style="text-align: center">{{ item.op|filterChecked }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <!--        table2-->
          <div style="text-align: center;background-color: #d7dff0">
            <h3>Service</h3>
            <table style="width: 100%">
              <thead>
              <tr>
                <td style="width: 3%">No.</td>
                <td style="">Item</td>
                <td style="width: 12%">ESET Scope</td>
                <td style="width: 12%">Customer<br>Scope</td>
                <td style="width: 12%">Optional</td>
              </tr>
              </thead>
              <tbody>
              <tr v-if="editable" v-for="item in quotation.Service" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.item }}</td>
                <td style="text-align: center"><input type="checkbox" v-model="item.es"></td>
                <td style="text-align: center"><input type="checkbox" v-model="item.cs"></td>
                <td style="text-align: center"><input type="checkbox" v-model="item.op"></td>
              </tr>

              <tr v-if="!editable" v-for="item in quotation.Service" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ service_item[item.id] }}</td>
                <td style="text-align: center">{{ item.es|filterChecked }}</td>
                <td style="text-align: center">{{ item.cs|filterChecked }}</td>
                <td style="text-align: center">{{ item.op|filterChecked }}</td>
              </tr>

              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div style="height: 1000px"></div>

    </div>

  </div>
</template>

<script>
import htmlToPdf from '@/utils/htmlToPdf.js'
import { Quotation } from '@/views/pages/eset/trackers2/utils/classQuotation'

export default {
  name: 'tbReportTemplate1',
  data() {
    return {
      editable: false,   //当为false时，不可编辑，但可打印
      buttonText: '报价单(当前仅预览)',
      buttonType: 'primary',
      quotation: this.inputdata.inputdata,//报价单模型数据

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

  methods: {
    pdfBtn() {
      htmlToPdf.getPdf(this.pdfTitle, 'pdfScope')
    },
    pdfEachBtn() {
      htmlToPdf.getPdf('01 Cover & Letter', 'PdfPage1')
      htmlToPdf.getPdf('02 Detail Quotation', 'PdfPage2')
      htmlToPdf.getPdf('03 Scope of Work', 'PdfPage3')
    },
    editStatus() {
      if (this.editable === false) {
        this.editable = true
        this.buttonText = '报价单(当前可编辑)'
        this.buttonType = 'success'
      } else {
        this.editable = false
        this.buttonText = '报价单(当前仅预览)'
        this.buttonType = 'primary'
      }
    }
  },
  computed:{
    pdfTitle(){
      // return this.quotation.project_name
      return ''
    }
  },
  filters: {
    filterChecked(value) {
      return value ? '√' : ''
    },
  },

  props: {
    inputdata: {
      type: Object,
      default: () => {
        let inputdata = new Quotation()
        return {
          inputdata
        }
      }
    }
  }
}
</script>

<style scoped>

#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 20px;
  max-width: 100%; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
}

.page1 td {
  text-align: right;
  font-size: 14px;
}

.page2 .catalog {
  font-size: 10px;
}

.page2 td {
  font-size: 6px;
  height: 20px;
}

.page2 .note {
  font-size: 6px;
  font-style: italic;

}

.page2 thead {
  background-color: #dbe9f5;
}

.page3 table {
  border-collapse: collapse; /* 确保边框不会重叠 */
}

.page3 thead {
  background-color: #dbe9f5;
  font-size: 16px;
  color: black;
}

.page3 tbody tr {
  height: 36px;
}

.page3 tbody tr td {

  text-align: left;
  color: black;
  font-size: 12px;
  border: 1px solid #fdfdfd;
}

.page {
  width: 900px;
  height: 1260px;
  margin-bottom: 20px;
  padding-top: 20px;
  background-color: #ecf3ef;
}

.scrollable-div {
  height: 1260px;
  overflow-y: scroll;
}
</style>
