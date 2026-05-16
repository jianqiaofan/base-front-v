<template>
    <div>
        <table style="width: 700px;">
            <!-- <caption  style="height: 30px;text-align: right;">
                <button @click="addPurlin">添加阻尼</button>&nbsp;&nbsp;
            </caption> -->
            <!-- <thead>
                <tr>
                    <td style="text-align: center;">阻尼立柱数量</td>
                    <td style="text-align: center;">阻尼型号</td>
                    <td style="text-align: center;">操作</td>
                </tr>
            </thead> -->
            <tbody>
                <tr v-for="item in dumperList" :key="item.id">

                    <td style="text-align: center;width:60px;">
                        <input type="text" v-model="item.dumperPost">
                    </td>

                    <td style="text-align: center;">
                        <select v-model="item.dumperSpecification">
                            <option v-for="option in select_option.damper_options" :key="option.value"
                                :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </td>

                    <td style="text-align: center;width:60px;">
                        <button @click="deletePurlin(item.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'AssebleDamper',
    data() {
        return {
            dumperList:[
                {id:1,dumperPost:2,dumperSpecification:450}
            ]


        }
    },
    methods:{
        addPurlin(){
            let newId = this.dumperList.length+1
            this.dumperList.push({id:newId,dumperPost:2,dumperSpecification:450})
        },
        deletePurlin(id){
            const index = this.dumperList.findIndex(item => item.id === id);
            // 如果对象存在，则移除它
            if (index !== -1) {
                this.dumperList.splice(index, 1);
            }
        }
    },
    props: {
        tracker: String,
        initialdata: {},
        select_option: {}
    }



}
</script>

<style scoped>
/* CSS样式 */
table {
  width: 1200px;
  margin-left: 60px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */

}

th, td {
  text-align: center;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}
</style>
