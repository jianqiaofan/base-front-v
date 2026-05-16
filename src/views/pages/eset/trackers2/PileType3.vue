<template>
  <div>
    <div v-show="true" style="width: 700px;background-color:#d1ffc4">
      <span style="font-size: 20px;">桩类型：3-钢桩</span><br>
      <table class="outer_table" style="width: 690px">
        <tr>
          <td style="width: 80px">钢桩</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr style="height: 60px">
                <td colspan="2">
                  <span style="margin-left: 0px">桩体长度：</span><input @change='pileDesc' v-model="pile_body.length" type="text" style="width: 60px">mm
                  <span>材质：</span>
                  <select @change='pileDesc' v-model="pile_body.material" style="width: 80px;display:inline-block">
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>防腐：</span>
                  <select @change='pileDesc' v-model="pile_body.corrosion_proofing_grade" style="width: 140px;display:inline-block">
                    <option v-for="option in pile_galvanizin_thickness_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <br>
                  <span style="margin-left: 0px">截面类型：</span>
                  <select @change='pileDesc' v-model="pile_body.section_type" style="width: 90px;display:inline-block">
                    <option v-for="option in pile_shape_type" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>

                  <span v-if="pile_body.section_type === 'H'">
                    H:<input type="text" v-model="pile_body.h" style="width: 50px">
                    W:<input type="text" v-model="pile_body.w" style="width: 50px">
                    Tf:<input type="text" v-model="pile_body.t1" style="width: 50px">
                    Tw:<input type="text" v-model="pile_body.t2" style="width: 50px">
                  </span>
                  <span v-else-if="pile_body.section_type === 'B'">
                    H:<input type="text" v-model="pile_body.h" style="width: 50px">
                    W:<input type="text" v-model="pile_body.w" style="width: 50px">
                    t:<input type="text" v-model="pile_body.t1" style="width: 50px">
                  </span>
                  <span v-else-if="pile_body.section_type === 'D'">
                    D:<input type="text" v-model="pile_body.h" style="width: 50px">
                    t:<input type="text" v-model="pile_body.t1" style="width: 50px">
                  </span>
                </td>

              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="width: 80px">连接螺栓</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr v-for="b in base_bolt_list" :key="b.id" style="height: 60px">
                <td>
                  <span style="margin-left: 0px">螺栓材质：</span>
                  <select @change='pileDesc' v-model="b.bolt_material" style="width: 80px;display:inline-block">
                  <option v-for="option in bolt_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>规格：</span>
                  <select @change='pileDesc' v-model="b.bolt_spec" style="width: 60px;display:inline-block">
                    <option v-for="option in bolt_spec_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>长度：</span><input @change='pileDesc' v-model="b.bolt_length" type="text" style="width: 40px">mm
                  <span>数量：</span>
                  <select @change='pileDesc' v-model="b.bolt_amount" style="width: 40px;display:inline-block">
                  <option v-for="option in num_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select><br>
                  <span style="margin-left: 0px">螺母等级：</span>
                  <select @change='pileDesc' v-model="b.nut_material" style="width: 80px;display:inline-block">
                    <option v-for="option in nut_material_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>螺母数量：</span>
                  <select @change='pileDesc' v-model="b.nut_amount" style="width: 70px;display:inline-block">
                    <option v-for="option in num_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>垫片数量：</span>
                  <select @change='pileDesc' v-model="b.washer_amount" style="width: 40px;display:inline-block">
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
              <tr  v-for="p in base_plate_list" :key="p.id">
                <td>
                  材质：<select @change='pileDesc' v-model="p.base_plate_material" style="width: 80px;display:inline-block">
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>长：</span><input @change='pileDesc' v-model="p.base_plate_length" type="text" style="width: 40px">
                  <span style="margin-left:2px">宽：</span><input @change='pileDesc' v-model="p.base_plate_width" type="text" style="width: 40px">
                  <span style="margin-left:2px">厚：</span><input @change='pileDesc' v-model="p.base_plate_thickness" type="text" style="width: 40px"> mm
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
              <tr  v-for="s in stiffener_list" :key="s.id">
                <td>
                  材质：<select @change='pileDesc' v-model="s.stiffener_material" style="width: 80px;display:inline-block">
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>长：</span><input @change='pileDesc' v-model="s.stiffener_length" type="text" style="width: 40px">
                  <span style="margin-left:2px">宽：</span><input @change='pileDesc' v-model="s.stiffener_width" type="text" style="width: 40px">
                  <span style="margin-left:2px">厚：</span><input @change='pileDesc' v-model="s.stiffener_thickness" type="text" style="width: 40px"> mm
                  <span>数量：</span><select @change='pileDesc' v-model="s.stiffener_amount" style="width: 40px;display:inline-block">
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
            <button @click="addBaseBolt">增加连接螺栓</button>
            <button @click="addBasePlate">增加连接板</button>
            <button @click="addStiffener">增加加劲肋</button>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <el-input type="textarea" @change='pileDesc' v-model="pile_desc" :rows="6"></el-input>
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

export default {
  name: 'PileType3',
  data() {
    return {
      pile_type: 3,
      type_name: '钢桩',
      weight: 0, //桩的额外材料的总重量  (比如：连接螺栓、法兰连接板、加劲肋、法兰连接螺栓等(钢村及柱柱一体时地面以下部分不计入此项))
      pile_desc:'',  //文字描述

      pile_body:
        { material:'Q355B',length: 1600, corrosion_proofing_grade:'65',section_type: 'H' ,h:200,w:150,t1:8,t2:6,section:'H200x150x8x6'},

      base_bolt_list: [
        { id: 0, bolt_material:'6.8级',bolt_spec: 'M16', bolt_length: 35, bolt_amount: 4 ,nut_material:'6.8级',nut_amount:'2',washer_amount:'2'}
      ],

      base_plate_list: [
        { id: 0, base_plate_material: 'Q355B', base_plate_length: 300, base_plate_width: 300,base_plate_thickness: 8,base_plate_amount: 1 }
      ],

      stiffener_list: [
        { id: 0, stiffener_material: 'Q355B', stiffener_length: 300, stiffener_width: 300,stiffener_thickness: 8,stiffener_amount: 4 }
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
        { text: 'M14', value: 'M14' },
        { text: 'M16', value: 'M16' },
        { text: 'M18', value: 'M18' },
        { text: 'M20', value: 'M20' },
        { text: 'M22', value: 'M22' },
        { text: 'M25', value: 'M25' },

      ],
      pile_shape_type:[
        { text: '钢管桩', value: 'D' },
        { text: '矩形管桩', value: 'B' },
        { text: 'H型钢桩', value: 'H' }
      ],
      bolt_material_options:[
        { text: '6.8级', value: '6.8级' },
        { text: '8.8级', value: '8.8级' }
      ],
      pile_galvanizin_thickness_options: [
        { text: '≥65μm热镀锌平均', value: '65' },
        { text: '≥85μm热镀锌平均', value: '85' },
        { text: '≥100μm热镀锌平均', value: '100' },
        { text: '≥120μm热镀锌平均', value: '120' }
      ],
      steel_material_options: [
        { text: 'Q235B', value: 'Q235B' },
        { text: 'Q355B', value: 'Q355B' },
        { text: 'Q420B', value: 'Q420B' }
      ],
      nut_material_options:[
        { text: '6.8级', value: '6.8级' },
        { text: '8.8级', value: '8.8级' },
      ]
    }
  },
  computed:{

  },
  props: ['receive','scope'],
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    //增加连接螺栓
    addBaseBolt(){
      let exitedId = []
      this.base_bolt_list.forEach((b)=>{exitedId.push(b.id)})
      let id = exitedId.length === 0 ? 0:Math.max(...exitedId)+1
      this.base_bolt_list.push(
        { id: id, bolt_material:'6.8级',bolt_spec: 'd16', bolt_length: 300, bolt_amount: 4 ,nut_material:'6.8级',nut_amount:'2',washer_amount:'2'}
      )
      this.pileDesc()
    },
    //增加连接板
    addBasePlate(){
      let exitedId = []
      this.base_plate_list.forEach((b)=>{exitedId.push(b.id)})
      let id = exitedId.length === 0 ? 0:Math.max(...exitedId)+1
      this.base_plate_list.push(
        { id: id, base_plate_material: 'Q355B', base_plate_length: 300, base_plate_width: 300,base_plate_thickness: 300,base_plate_amount: 1 }
      )
      this.pileDesc()
    },
    //增加加劲肋
    addStiffener(){
      let exitedId = []
      this.stiffener_list.forEach((b)=>{exitedId.push(b.id)})
      let id = exitedId.length === 0 ? 0:Math.max(...exitedId)+1
      this.stiffener_list.push(
        { id: id, stiffener_material: 'Q355B', stiffener_length: 300, stiffener_width: 300,stiffener_thickness: 300,stiffener_amount: 4 }
      )
      this.pileDesc()
    },
    removeBolt(id){
      const index = this.base_bolt_list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.base_bolt_list.splice(index, 1);
      }
      this.pileDesc()
    },
    removeBasePlate(id){
      const index = this.base_plate_list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.base_plate_list.splice(index, 1);
      }
      this.pileDesc()
    },
    removeStiffener(id){
      const index = this.stiffener_list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.stiffener_list.splice(index, 1);
      }
      this.pileDesc()
    },
    //文字描述
    pileDesc(){
      let i = 0;
      let r = ''
      let section_name=''
      let section=''
      let pl = this.pile_body
      if (pl.section_type === 'H'){
        section_name = 'H型钢桩'
        section = 'H'+ pl.h+'x'+ pl.w+'x'+ pl.t1+'x'+ pl.t2
      }else if (pl.section_type === 'B'){
        section_name = '矩形管桩'
        section = 'B'+ pl.h+'x'+ pl.w+'x'+ pl.t1

      }else if (pl.section_type === 'D'){
        section_name = '钢管桩'
        section = 'D'+ pl.h+'x'+ pl.t1
      }

      this.pile_body.section = section
      r += '钢桩基础' + '\n'
      r += '桩体：' + section_name + '，截面：' + section + '；' + '桩体长度：' + pl.length +',材质：' + pl.material
        +',热镀锌防腐，平均厚度≥'+pl.corrosion_proofing_grade+'μm' +'\n'
      i = this.base_bolt_list.length >1 ? 1:0
      this.base_bolt_list.forEach(b=>{
        r += '连接螺栓'+i+'：' + b.bolt_spec + '-'+ b.bolt_material + ','+'长度'+b.bolt_length + 'mm,'+'数量'+b.bolt_amount + '根;'
          +'每根连接螺栓配' + b.nut_amount + '个螺母和'+b.washer_amount + '个垫片,' + '螺母等级' + b.nut_material + ','+ '\n'
        i++
      })

      i = this.base_plate_list.length >1 ? 1:0
      this.base_plate_list.forEach(p=>{
        r += '连接板'+i+'：' + '材质'+p.base_plate_material + ','+ '长x宽x厚'+ p.base_plate_length+ 'x'+ p.base_plate_width+ 'x'
          + p.base_plate_thickness + 'mm,'+'数量'+p.base_plate_amount + '块'+ '\n'
        i++
      })

      i = this.stiffener_list.length >1 ? 1:0
      this.stiffener_list.forEach(s=>{
        r += '加劲肋'+i+'：' + '材质'+s.stiffener_material + ','+ '长x宽x厚'+ s.stiffener_length+ 'x'+ s.stiffener_width+ 'x'
          + s.stiffener_thickness + 'mm,'+'数量'+s.stiffener_amount + '块'+ '\n'
        i++
      })

      r = r.replaceAll('连接螺栓0','连接螺栓')
        .replaceAll('连接板0','连接板')
        .replaceAll('加劲肋0','加劲肋')
      this.pile_desc = r
    },
    makeSure(){
      this.pileDesc()
    },
    clickCancel(){
      this.receive({
        clicked:'cancel',
        scope:this.scope
      })
    },
    clickSure(){
      this.pileDesc()
      let pileObj = {
        clicked:'sure',
        scope:this.scope,
        pile_type:this.pile_type,
        pile_obj:{
          pile_type:this.pile_type,
          pile_body:this.pile_body,
          base_bolt_list:this.base_bolt_list,
          base_plate_list:this.base_plate_list,
          stiffener_list:this.stiffener_list,
        },
        pile_desc:this.pile_desc
      }
      this.receive(pileObj)
    },

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
