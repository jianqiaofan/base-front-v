<template>
    <div>
        <h2>控制系统</h2>
    </div>
</template>

<script>

export default {
    name: 'AssebleControl',
    data() {
        return {
        }
    },
    components: {

    },
    props: {
        tracker: String,
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
