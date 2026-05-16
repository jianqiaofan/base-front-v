<template>
    <div>
        <table style="background-color: aliceblue;">
            <tr v-show="initialdata.postTableIfShow === 1">
<!--                <td style="width:80px">-->
<!--                    <h4>立柱</h4>-->
<!--                </td>-->
                <td>
                    <AsseblePost :tc="tc" :initialdata="initialdata" :select_option="select_option">
                    </AsseblePost>
                </td>
            </tr>
            <tr v-show="initialdata.beamTableIfShow === 1">
                <td>
                    <AssebleBeam :beamList="tc.beam_info_lst" :initialdata="initialdata"></AssebleBeam>
                </td>
            </tr>

        </table>
    </div>
</template>

<script>
import AsseblePost from '@/views/pages/eset/trackers2/AsseblePost.vue';
import AssebleBeam from '@/views/pages/eset/trackers2/AssebleBeam.vue';
import AsseblePurlin from '@/views/pages/eset/trackers2/AsseblePurlin.vue';
import AssebleDamper from '@/views/pages/eset/trackers2/AssebleDamper.vue';
import AssebleControl from '@/views/pages/eset/trackers2/AssebleControl.vue';



export default {
    name: 'TrackerAssembles',
    data() {
        return {
            postList: [
            ]
        }
    },
    components: {
        AsseblePost,
        AssebleBeam,
        AsseblePurlin,
        AssebleDamper,
        AssebleControl
    },
    props: {
        tracker: String,
        tc:{},
        select_option: {},
        initialdata: {}
    },

}
</script>

<style scoped>
/* CSS样式 */
table {
  width: 700px;
  margin-left: 60px;
  border-collapse: collapse; /* 确保边框不会重叠 */
  border: 1px solid black; /* 设置表格边框颜色和宽度 */

}

th, td {
  text-align: center;
  border: 1px solid black; /* 设置表格内部单元格边框颜色和宽度 */
}
</style>
