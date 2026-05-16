<template>
  <div>
    <div v-show="true" style="width: 700px;background-color:#d1ffc4">
      <span style="font-size: 20px;">桩类型：1-地脚螺栓</span><br>
      <table class="outer_table" style="width: 690px">
        <tr>
          <td style="width: 80px">地脚螺栓</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr v-for="b in base_bolt_list" :key="b.id" style="height: 60px">
                <td>
                  <span style="margin-left: 0px">螺栓材质：</span>
                  <select @change="pileDesc" v-model="b.bolt_material" style="width: 80px;display:inline-block">
                    <option v-for="option in bolt_material_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>规格：</span>
                  <select @change="pileDesc" v-model="b.bolt_spec" style="width: 50px;display:inline-block">
                    <option v-for="option in bolt_spec_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>长度：</span><input @change="pileDesc" v-model="b.bolt_length" type="text" style="width: 60px">mm
                  <span>数量：</span>
                  <select @change="pileDesc" v-model="b.bolt_amount" style="width: 40px;display:inline-block">
                    <option v-for="option in num_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select><br>
                  <span style="margin-left: 0px">螺母等级：</span>
                  <select @change="pileDesc" v-model="b.nut_material" style="width: 80px;display:inline-block">
                    <option v-for="option in nut_material_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>螺母数量：</span>
                  <select @change="pileDesc" v-model="b.nut_amount" style="width: 70px;display:inline-block">
                    <option v-for="option in num_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>垫片数量：</span>
                  <select @change="pileDesc" v-model="b.washer_amount" style="width: 40px;display:inline-block">
                    <option v-for="option in num_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </td>
                <td style="width: 80px;text-align: right">
                  <button style="margin-right: 6px" @click="removeBolt(b.id)">删除</button>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>连接板</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr v-for="p in base_plate_list" :key="p.id">
                <td>
                  材质：<select @change="pileDesc" v-model="p.base_plate_material"
                               style="width: 80px;display:inline-block"
                >
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>长：</span><input @change="pileDesc" v-model="p.base_plate_length" type="text"
                                         style="width: 40px"
                >
                  <span style="margin-left:2px">宽：</span><input @change="pileDesc" v-model="p.base_plate_width"
                                                                 type="text" style="width: 40px"
                >
                  <span style="margin-left:2px">厚：</span><input @change="pileDesc" v-model="p.base_plate_thickness"
                                                                 type="text" style="width: 40px"
                > mm
                </td>
                <td style="width: 80px;text-align: right">
                  <button style="margin-right: 6px" @click="removeBasePlate(p.id)">删除</button>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>加劲肋</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr v-for="s in stiffener_list" :key="s.id">
                <td>
                  材质：<select @change="pileDesc" v-model="s.stiffener_material"
                               style="width: 80px;display:inline-block"
                >
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>长：</span><input @change="pileDesc" v-model="s.stiffener_length" type="text"
                                         style="width: 40px"
                >
                  <span style="margin-left:2px">宽：</span><input @change="pileDesc" v-model="s.stiffener_width"
                                                                 type="text" style="width: 40px"
                >
                  <span style="margin-left:2px">厚：</span><input @change="pileDesc" v-model="s.stiffener_thickness"
                                                                 type="text" style="width: 40px"
                > mm
                  <span>数量：</span><select @change="pileDesc" v-model="s.stiffener_amount"
                                            style="width: 40px;display:inline-block"
                >
                  <option v-for="option in num_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select> 块
                </td>
                <td style="width: 80px;text-align: right">
                  <button style="margin-right: 6px" @click="removeStiffener(s.id)">删除</button>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td colspan="3" style="text-align: right">
            <button @click="addBaseBolt">增加地脚螺栓</button>
            <button @click="addBasePlate">增加连接板</button>
            <button @click="addStiffener">增加加劲肋</button>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <el-input type="textarea" @change="pileDesc" v-model="pile_desc" :rows="6"></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right">
            <button @click="makeSure">刷新描述</button>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: right">
      <el-button @click="clickCancel" size="small" icon="el-icon-refresh-right">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="clickSure" size="small">确 定</el-button>
    </div>

  </div>

</template>

<script>

import { boolean } from 'mockjs/src/mock/random/basic'

export default {
  name: 'PileType1',
  data() {
    return {
      pile_type: 1,
      type_name: '地脚螺栓',
      pile_desc: '',  //文字描述

      base_bolt_list: [
        {
          id: 0,
          bolt_material: '6.8级',
          bolt_spec: 'd16',
          bolt_length: 300,
          bolt_amount: 4,
          nut_material: '6.8级',
          nut_amount: '2',
          washer_amount: '2'
        }
      ],

      base_plate_list: [
        {
          id: 0,
          base_plate_material: 'Q355B',
          base_plate_length: 300,
          base_plate_width: 300,
          base_plate_thickness: 8,
          base_plate_amount: 1
        }
      ],

      stiffener_list: [
        {
          id: 0,
          stiffener_material: 'Q355B',
          stiffener_length: 300,
          stiffener_width: 300,
          stiffener_thickness: 8,
          stiffener_amount: 4
        }
      ],

      num_options: [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
        { text: '6', value: '6' },
        { text: '7', value: '7' },
        { text: '8', value: '8' }
      ],

      bolt_spec_options: [
        { text: 'φ16', value: 'd16' },
        { text: 'φ18', value: 'd18' },
        { text: 'φ20', value: 'd20' },
        { text: 'φ22', value: 'd22' },
        { text: 'φ25', value: 'd25' }
      ],

      bolt_material_options: [
        { text: '6.8级', value: '6.8级' },
        { text: '8.8级', value: '8.8级' }
      ],
      steel_material_options: [
        { text: 'Q235B', value: 'Q235B' },
        { text: 'Q355B', value: 'Q355B' },
        { text: 'Q420B', value: 'Q420B' }
      ],
      nut_material_options: [
        { text: '6.8级', value: '6.8级' },
        { text: '8.8级', value: '8.8级' }
      ]
    }
  },
  props: ['receive','scope'],
  computed: {},

  methods: {
    onSubmit() {
      console.log('submit!')
    },
    //增加地脚螺栓
    addBaseBolt() {
      let exitedId = []
      this.base_bolt_list.forEach((b) => {
        exitedId.push(b.id)
      })
      let id = exitedId.length === 0 ? 0 : Math.max(...exitedId) + 1
      this.base_bolt_list.push(
        {
          id: id,
          bolt_material: '6.8级',
          bolt_spec: 'd16',
          bolt_length: 300,
          bolt_amount: 4,
          nut_material: '6.8级',
          nut_amount: '2',
          washer_amount: '2'
        }
      )
      this.pileDesc()
    },
    //增加连接板
    addBasePlate() {
      let exitedId = []
      this.base_plate_list.forEach((b) => {
        exitedId.push(b.id)
      })
      let id = exitedId.length === 0 ? 0 : Math.max(...exitedId) + 1
      this.base_plate_list.push(
        {
          id: id,
          base_plate_material: 'Q355B',
          base_plate_length: 300,
          base_plate_width: 300,
          base_plate_thickness: 300,
          base_plate_amount: 1
        }
      )
      this.pileDesc()
    },
    //增加加劲肋
    addStiffener() {
      let exitedId = []
      this.stiffener_list.forEach((b) => {
        exitedId.push(b.id)
      })
      let id = exitedId.length === 0 ? 0 : Math.max(...exitedId) + 1
      this.stiffener_list.push(
        {
          id: id,
          stiffener_material: 'Q355B',
          stiffener_length: 300,
          stiffener_width: 300,
          stiffener_thickness: 300,
          stiffener_amount: 4
        }
      )
      this.pileDesc()
    },
    removeBolt(id) {
      const index = this.base_bolt_list.findIndex(item => item.id === id)
      if (index !== -1) {
        this.base_bolt_list.splice(index, 1)
      }
      this.pileDesc()
    },
    removeBasePlate(id) {
      const index = this.base_plate_list.findIndex(item => item.id === id)
      if (index !== -1) {
        this.base_plate_list.splice(index, 1)
      }
      this.pileDesc()
    },
    removeStiffener(id) {
      const index = this.stiffener_list.findIndex(item => item.id === id)
      if (index !== -1) {
        this.stiffener_list.splice(index, 1)
      }
      this.pileDesc()
    },
    //文字描述
    pileDesc() {
      let i = 0
      let r = ''
      i = this.base_bolt_list.length > 1 ? 1 : 0
      this.base_bolt_list.forEach(b => {
        r += '地脚螺栓' + i + '：' + b.bolt_spec + '-' + b.bolt_material + ',' + '长度' + b.bolt_length + 'mm,' + '数量' + b.bolt_amount + '根;'
          + '每根地脚螺栓配' + b.nut_amount + '个螺母和' + b.washer_amount + '个垫片,' + '螺母等级' + b.nut_material + ',' + '\n'
        i++
      })

      i = this.base_plate_list.length > 1 ? 1 : 0
      this.base_plate_list.forEach(p => {
        r += '连接板' + i + '：' + '材质' + p.base_plate_material + ',' + '长x宽x厚' + p.base_plate_length + 'x' + p.base_plate_width + 'x'
          + p.base_plate_thickness + 'mm,' + '数量' + p.base_plate_amount + '块' + '\n'
        i++
      })

      i = this.stiffener_list.length > 1 ? 1 : 0
      this.stiffener_list.forEach(s => {
        r += '加劲肋' + i + '：' + '材质' + s.stiffener_material + ',' + '长x宽x厚' + s.stiffener_length + 'x' + s.stiffener_width + 'x'
          + s.stiffener_thickness + 'mm,' + '数量' + s.stiffener_amount + '块' + '\n'
        i++
      })

      r = r.replaceAll('地脚螺栓0', '地脚螺栓')
        .replaceAll('连接板0', '连接板')
        .replaceAll('加劲肋0', '加劲肋')
      this.pile_desc = r
    },
    makeSure() {
      this.pileDesc()
    },
    clickCancel(){
      this.receive({
        clicked:'cancel',
        scope:this.scope
      })
    },
    clickSure() {
      this.pileDesc()
      let pileObj = {
        clicked:'sure',
        scope:this.scope,
        pile_type:this.pile_type,
        pile_obj:{
          pile_type:this.pile_type,
          base_bolt_list: this.base_bolt_list,
          base_plate_list: this.base_plate_list,
          stiffener_list: this.stiffener_list
        },
        pile_desc: this.pile_desc
      }
      this.receive(pileObj)
    }
  }

}
</script>

<style scoped>
.outer_table {
  margin-left: 5px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */
}

.outer_table th, .outer_table td {
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}

.inner_table {
  margin-left: 5px;
}

.inner_table th, .inner_table td {
  border: 0px; /* 设置表格内部单元格边框颜色和宽度 */
}

span {
  margin-left: 10px;
}

button {
  margin: 5px;
}
</style>
