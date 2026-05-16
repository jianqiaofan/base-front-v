<template>
  <div>
    <div v-show="true" style="width: 700px;background-color:#d1ffc4">
      <span style="font-size: 20px;">桩类型：2-PHC混凝土预制桩</span><br>
      <h4>PHC混凝土预制桩甲供，不在我方施工范围</h4>
    </div>
    <div style="text-align: right">
      <el-button @click="clickCancel" size="small" icon="el-icon-refresh-right">取 消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="clickSure" size="small">确 定</el-button>
    </div>

  </div>

</template>

<script>

export default {
  name: 'PileType2',
  data() {
    return {
      pile_type: 2,
      type_name: 'PHC混凝土预制桩',
    }
  },
  computed:{

  },
  props: ['receive','scope'],
  methods: {
    onSubmit() {
      console.log('submit!')
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
      let pileObj = {
        clicked:'sure',
        scope:this.scope,
        pile_type:this.pile_type,
        pile_obj:{
          pile_type:this.pile_type,
        },
        pile_desc:'PHC预制桩甲供'
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
