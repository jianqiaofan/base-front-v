<template>
  <div>
    <div v-show="true" style="width: 700px;background-color:#d1ffc4">
      <span style="font-size: 20px;">桩类型：0-桩柱一体</span><br>
      <table class="outer_table" style="width: 690px">
        <tr>
          <td style="width: 80px;">立柱埋深</td>
          <td>
            <table class="inner_table" style="width: 100%">
              <tr style="height: 60px">
                <td>
                  <input @change='pileDesc' v-model="pile_depth" type="text" style="width: 60px">mm
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <el-input type="textarea" @change='pileDesc' v-model="pile_desc" :rows="3"></el-input>
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
  name: 'PileType0',
  data() {
    return {
      pile_type: 0,
      type_name: '桩柱一体',
      pile_desc:'',  //文字描述
      pile_depth:1500,  //埋深
    }
  },
  computed:{

  },
  props: ['receive','scope'],
  methods: {
    onSubmit() {
      console.log('submit!')
    },

    //文字描述
    pileDesc(){
      this.pile_desc = '桩柱一体，埋深' + this.pile_depth + 'mm，截面、材质和防腐等级同地面以上'
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
          pile_depth: this.pile_depth
        },
        pile_desc: this.pile_desc
      }
      this.receive(pileObj)
    },
  },


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
  border: 0; /* 设置表格内部单元格边框颜色和宽度 */
}

span {
  margin-left: 10px;
}

button {
  margin: 5px;
}
</style>
