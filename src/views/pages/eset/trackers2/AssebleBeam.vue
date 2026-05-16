<template>
    <div>
        <table style="width: 700px;">
            <thead>
                <tr>
                    <td style="text-align: center;">起点</td>
                    <td style="text-align: center;">终点</td>
                    <td style="text-align: center;">截面</td>
                    <td style="text-align: center;">材质</td>
                    <td style="text-align: center;">长度</td>
                    <td style="text-align: center;">类别</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in beamList" :key="item.position">
                    <td style="text-align: center;width:80px;">{{ item.start }}</td>
                    <td style="text-align: center;width:80px;">{{ item.end }}</td>
                    <td style="text-align: center;width:166px;">{{ item.section }}</td>
                    <td style="text-align: center;width:80px;">{{ item.material }}</td>
                    <td style="text-align: center;width:60px;">{{ item.length }}</td>
                    <td style="text-align: center;">{{ item.category }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'AssebleBeam',
    data() {
        return {
            tableIfShow:0,
            buttonValueBeam:'显示主梁列表'
        }
    },
    methods:{
        tableShow(){
            this.tableIfShow =  (this.tableIfShow+1)%2;
            if(this.buttonValueBeam === '显示主梁列表'){
                this.buttonValueBeam = '隐藏主梁列表'
            }
            else{
                this.buttonValueBeam = '显示主梁列表'
            }
        },
    },
    components: {

    },
    props: {
        tracker: String,
        beamList:{},
        initialdata:{},
        select_option:{}
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
