<template>
    <div>
        <table style="width: 700px;">
            <caption  style="height: 30px;text-align: right;">
                <button @click="addPurlin">添加檩条截面</button>&nbsp;&nbsp;
            </caption>
            <thead>
                <tr>
                    <td style="text-align: center;">型号</td>
                    <td style="text-align: center;">材质</td>
                    <td style="text-align: center;">长度</td>
                    <td style="text-align: center;">根数</td>
                    <td style="text-align: center;">操作</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in purlinList" :key="item.id">
                    <td style="text-align: center;width:80px;">
                        <select v-model="item.section">
                            <option v-for="option in select_option.purlin_section_options" :key="option.value"
                                :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </td>

                    <td style="text-align: center;width:80px;">
                        <select v-model="item.material">
                            <option v-for="option in select_option.purlin_material_options" :key="option.value"
                                :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </td>

                    <td style="text-align: center;width:80px;">
                        <select v-model="item.length">
                            <option v-for="option in select_option.purlin_length_options" :key="option.value"
                                :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </td>

                    <td style="text-align: center;width:60px;">
                        <input type="text" v-model="item.amount">
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
    name: 'AsseblePurlin',
    data() {
        return {
            purlinList:[
                {id:1,material:'S450GD',section:'-1.5x30x30x60',length:840,amount:30}
            ]


        }
    },
    methods:{
        addPurlin(){
            let newId = this.purlinList.length+1
            this.purlinList.push({id:newId,material:'S450GD',section:'-1.5x30x30x60',length:840,amount:30})
        },
        deletePurlin(id){
            const index = this.purlinList.findIndex(item => item.id === id);
            // 如果对象存在，则移除它
            if (index !== -1) {
                this.purlinList.splice(index, 1);
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

<style></style>