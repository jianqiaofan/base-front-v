<template>
  <div>
    <span>桩类型：0-桩柱一体</span><br>
    <h1>PileComponent</h1>
    <div v-show="false" style="width: 300px;background-color:bisque">
      桩深：<input type="text" style="width: 100px">mm
    </div>
    <div style="height: 40px"></div>
    <div v-show="true" style="width: 700px;background-color:#d1ffc4">
      <span>桩类型：1-地脚螺栓</span><br>
      <table class="outer_table" style="width: 690px">
        <tr>
          <td style="width: 80px">地脚螺栓</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr v-for="b in base_bolt_list" key="b.id" style="height: 60px">
                <td>
                  <span style="margin-left: 0px">螺栓材质：</span>
                  <select v-model="b.bolt_spec" style="width: 80px;display:inline-block">
                  <option v-for="option in bolt_spec_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>螺栓长度：</span><input v-model="b.bolt_length" type="text" style="width: 40px">mm
                  <span>螺栓数量：</span>
                  <select v-model="b.bolt_amount" style="width: 40px;display:inline-block">
                  <option v-for="option in num_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select><br>
                  <span style="margin-left: 0px">螺母等级：</span>
                  <select v-model="b.nut_material" style="width: 80px;display:inline-block">
                    <option v-for="option in nut_material_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>螺母数量：</span>
                  <select v-model="b.nut_amount" style="width: 70px;display:inline-block">
                    <option v-for="option in num_options" :key="option.value"
                            :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  <span>垫片数量：</span>
                  <select v-model="b.washer_num" style="width: 40px;display:inline-block">
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
              <tr  v-for="p in base_plate_list" key="p.id">
                <td>
                  材质：<select v-model="p.base_plate_material" style="width: 80px;display:inline-block">
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>长：</span><input v-model="p.base_plate_length" type="text" style="width: 40px">
                  <span style="margin-left:2px">宽：</span><input v-model="p.base_plate_width" type="text" style="width: 40px">
                  <span style="margin-left:2px">厚：</span><input v-model="p.base_plate_thickness" type="text" style="width: 40px"> mm
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
              <tr  v-for="s in stiffener_list" key="s.id">
                <td>
                  材质：<select v-model="s.stiffener_material" style="width: 80px;display:inline-block">
                  <option v-for="option in steel_material_options" :key="option.value"
                          :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                  <span>长：</span><input v-model="s.stiffener_length" type="text" style="width: 40px">
                  <span style="margin-left:2px">宽：</span><input v-model="s.stiffener_width" type="text" style="width: 40px">
                  <span style="margin-left:2px">厚：</span><input v-model="s.stiffener_thickness" type="text" style="width: 40px"> mm
                  <span>数量：</span><select v-model="s.stiffener_amount" style="width: 40px;display:inline-block">
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
          <td colspan="3">
            <el-input type="textarea" v-model="pile_desc"></el-input>
          </td>
        </tr>

        <tr>
          <td colspan="3" style="text-align: right">
            <button @click="addBaseBolt">增加地脚螺栓</button>
            <button @click="addBasePlate">增加连接板</button>
            <button @click="addStiffener">增加加劲肋</button>
          </td>
        </tr>

      </table>


    </div>
    <div style="height: 40px"></div>
    <div v-show="false" style="width: 300px;background-color:bisque">
      <span>桩类型：2-PHC管桩</span><br>
      桩深：<input type="text" style="width: 100px">mm
    </div>
    <div style="height: 40px"></div>
    <div v-show="false" style="width: 300px;background-color:#d1ffc4">
      <span>桩类型：3-钢桩</span><br>
      桩深：<input type="text" style="width: 100px">mm
      桩截面：
    </div>
  </div>

</template>

<script>

export default {
  name: 'PileComponent',
  data() {
    return {
      type: 0,
      type_name: '桩柱一体',
      pile_depth: 1500,
      section: '',//当采用桩柱一体或钢桩时采用
      weight: 0, //桩的额外材料的总重量  (比如：地脚螺栓、法兰连接板、加劲肋、法兰连接螺栓等(钢村及柱柱一体时地面以下部分不计入此项))
      pile_desc: '',  //桩的额外材料重量的描述，后面检查重量时有依据

      base_bolt_list: [
        { id: 0, bolt_spec: 'd16', bolt_length: 300, bolt_amount: 4 ,nut_material:'6.8级',nut_amount:'2',washer_num:'2'}
      ],

      base_plate_list: [
        { id: 0, base_plate_material: 'Q355B', base_plate_length: 300, base_plate_width: 300,base_plate_thickness: 300,base_plate_amount: 1 }
      ],

      stiffener_list: [
        { id: 0, stiffener_material: 'Q355B', stiffener_length: 300, stiffener_width: 300,stiffener_thickness: 300,stiffener_amount: 4 }
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
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    //增加地脚螺栓
    addBaseBolt(){
      let exitedId = []
      this.base_bolt_list.forEach((b)=>{exitedId.push(b.id)})
      let id = exitedId.length === 0 ? 0:Math.max(...exitedId)+1
      this.base_bolt_list.push(
        { id: id, bolt_spec: 'd16', bolt_length: 300, bolt_amount: 4 ,nut_material:'6.8级',nut_amount:'2',washer_num:'2'}
      )
    },
    //增加连接板
    addBasePlate(){
      let exitedId = []
      this.base_plate_list.forEach((b)=>{exitedId.push(b.id)})
      let id = exitedId.length === 0 ? 0:Math.max(...exitedId)+1
      this.base_plate_list.push(
        { id: id, base_plate_material: 'Q355B', base_plate_length: 300, base_plate_width: 300,base_plate_thickness: 300,base_plate_amount: 1 }
      )
    },
    //增加加劲肋
    addStiffener(){
      let exitedId = []
      this.stiffener_list.forEach((b)=>{exitedId.push(b.id)})
      let id = exitedId.length === 0 ? 0:Math.max(...exitedId)+1
      this.stiffener_list.push(
        { id: id, stiffener_material: 'Q355B', stiffener_length: 300, stiffener_width: 300,stiffener_thickness: 300,stiffener_amount: 4 }
      )
    },
    removeBolt(id){
      const index = this.base_bolt_list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.base_bolt_list.splice(index, 1);
      }
    },
    removeBasePlate(id){
      const index = this.base_plate_list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.base_plate_list.splice(index, 1);
      }
    },
    removeStiffener(id){
      const index = this.stiffener_list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.stiffener_list.splice(index, 1);
      }
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
