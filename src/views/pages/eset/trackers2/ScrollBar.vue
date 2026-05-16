<template>
  <div class="container">
    <h1 class="title">友情提示:</h1>
    <ul class="list">
      <li>沙特项目立柱、主梁、檩条要使用本地化价格</li>
      <li>以方案为操作对象，一个项目可以有多个方案</li>
      <li>方案确定后，请及时提交校核人进行校核</li>
      <li>计算如果出现异常，必须联系管理员进行处理</li>
      <li>请认真核对价格是否是合理区间</li>
    </ul>
  </div>

</template>
<script>

export default {
  name: 'ScrollBar',
  data() {
    return {

    }
  },
  props: [],
  methods: {
    barScrollBar(){
      //初始化：
      let list = document.querySelector('.list');
      //1.将列表中的第一个元素，克隆到列表的最后一个
      function cloneFirstItem() {
        let fisrstItem = list.children[0];
        let newItem = fisrstItem.cloneNode(true);
        list.appendChild(newItem);
      }
      cloneFirstItem();

//2.滚动:每隔一段时间，将列表滚动到下一个位置
      let duration = 2000;
      setInterval(moveNext, duration);
      let itemHeight = 30;  //每一项的高度
      let curIndex = 0;  //目前展示的是第几项
// 将列表流动到下个位置
      function moveNext() {
        let from = curIndex * itemHeight;  //开始的滚动高度
        curIndex++;
        let to = curIndex * itemHeight;  //下一项的滚动高度
        //让list的scrollTop,从from慢慢变为to
        //慢慢变为：在一段时间内，每隔一小段时间，变化一点
        let totalDuration = 300;
        let duration = 10;
        let times = totalDuration / duration;   //变化的次数
        let dis = (to - from) / times;  //每次变化的量
        let timerId = setInterval(function () {
          from += dis;
          if (from >= to) {
            //到达目标值
            clearInterval(timerId);  //停止计时器
            //滚动完成后，如果是最后一项
            if (curIndex === list.children.length - 1) {
              from = 0;
              curIndex = 0;
            }
          }
          list.scrollTop = from;
        }, duration);
      }
    }

  },

  mounted(){
    this.barScrollBar();
  }


}
</script>

<style scoped>
.container {
  background:#bfedfc;
  overflow:hidden;
  padding:20px 0;
}
.container::after{
  content:'';
  display:block;
  clear:both;
}
.title{
  margin:0;
  float:left;
  font-size:16px;
  font-weight: normal;
  margin-left:20px;
  margin-top:5px;
  border-right:2px solid #ccc;
  padding-right:30px;

}
.list{
  margin:0;
  margin-left:10px;
  float:left;
  list-style:none;
  padding:0;
  height:30px;
  overflow:hidden;

}
.list li {
  height:30px;
  line-height: 30px;
}


</style>
