<template>
    <div>
        <table style="width: 700px;">
            <thead>
                <tr>
                    <td style="text-align: center;">位置</td>
                    <td style="text-align: center;">驱动</td>
                    <td style="text-align: center;">截面</td>
                    <td style="text-align: center;">材质</td>
                    <td style="text-align: center;">高度</td>
                    <td style="text-align: center;">基础类型</td>
                    <td style="text-align: center;">埋深/法兰重量调整</td>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item in postList" :key="item.position">
                    <td style="text-align: center;width:80px;">{{ item.position }}</td>
                    <td style="text-align: center;width:80px;">{{ item.category }}</td>
                    <td style="text-align: center;width:80px;">{{ item.section }}</td>
                    <td style="text-align: center;width:80px;">{{ item.material }}</td>
                    <td style="text-align: center;width:60px;">{{ item.height }}</td>
                    <td style="text-align: center;width:80px;">
                        <select v-model="item.pileType">
                            <option v-for="option in select_option.post_type_options" :key="option.value"
                                :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </td>
                    <td style="text-align: left;">
                        <!-- 桩柱一体时显示 -->
                        <span v-if="item.pileType === 0">
                            <label>&nbsp;&nbsp;埋深：&nbsp;</label>
                            <input type="text" v-model="item.pileDepth" style="width: 40px;">&nbsp;&nbsp;mm
                        </span>
                        <!-- 带法兰时显示 -->
                        <span v-if="item.pileType === 1">
                            <label>&nbsp;&nbsp;调整系数：</label>
                            <input type="text" v-model="item.fweight_factor" style="width: 40px;">
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>

//获取柱子列表字符串
export default {
    name: 'AsseblePost',
    data() {
        return {
            postList:this.tc.post_info_lst
        }
    },
    methods: {

        // depthChange(event) {
        //     const textValue = event.target.value;
        //     this.postList.forEach((e) => e.pileDepth = textValue)
        // },
        // fweightFactorChange(event) {
        //     const textValue = event.target.value;
        //     this.postList.forEach((e) => e.fweight_factor = textValue)
        // },
    },
    props: {
        tracker: String,
        tc: {},
        initialdata: {},
        select_option: {}
    }

}

</script>

<style scoped>
/* CSS样式 */
table {
  margin-left: 60px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */

}

th, td {
  text-align: center;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}
</style>
