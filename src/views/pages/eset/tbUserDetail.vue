<template>
  <div id="app-container">
    <h2>Your Name:{{ name }}</h2>
    <span>Dingtalk Email:</span>
    <input type="text" style="width:200px" v-model="myInformation.dingEmail" placeholder="your email adress">@dingtalk.com
    <button @click="updateDingtalkEmail">update</button>
    <div>
      <p style="font-weight: bold">问：我们为什么选择钉钉邮箱？</p>
      <p>答：因为钉钉邮箱有很好的信息提醒功能，一旦有了新的邮件，他会在钉钉应用软件中闪动提醒，这样您不容易错过最新的消息。</p>
      <p style="font-weight: bold">问：我的钉钉邮箱账号是什么，我需要申请吗？</p>
      <p>
        答：您不需要重新申请钉钉邮箱，当你注册了钉钉账号时，钉钉会自动为您分配一个邮箱账号。可以在工作台中查看。教程如下：
      </p><a href="https://jingyan.baidu.com/article/656db918a14552a280249c64.html" target="_blank">https://jingyan.baidu.com/article/656db918a14552a280249c64.html</a>
    </div>
    <p>请务必在您的钉钉邮件中，将<span style="font-weight: bold;color: red">13953637@qq.com</span>加入到邮箱白名单中，以防钉钉邮件将邮件误判为垃圾邮件而拦截</p>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'tbMyInformation',
  components: {},
  data() {
    return {
      myInformation: {
        dingEmail: ''
      }
    }
  },
  computed: {
    ...
      mapGetters([
        'name'
      ])
  },

  methods: {
    updateDingtalkEmail() {
      if (this.myInformation.dingEmail.includes('@')) {
        this.myInformation.dingEmail = this.myInformation.dingEmail.split('@')[0]
      }
      this.fetchUpdataDingTalkEmail()
    },

    //获取我的信息
    fetchMyInformation() {
      fetch(process.env.VUE_APP_BASE_API + '/api/getMyInformation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({ username: this.name })
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            return response.json()
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {
          if (r.data !== undefined && r.data.length > 0) {
            this.myInformation.dingEmail = r.data[0].ding_email
          }
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    },

    //修改我的钉邮地址
    fetchUpdataDingTalkEmail() {
      fetch(process.env.VUE_APP_BASE_API + '/api/updateMyDingEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({ username: this.name, dingEmail: this.myInformation.dingEmail })
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            this.$message.success(response.message || 'Dingtalk update success')
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(() => {
          this.fetchMyInformation()
        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    }
  },
  created() {
    this.fetchMyInformation()
  }

}
</script>

<style scoped>
#app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 20px;
  width: 800px; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
}
a {
  color: blue;
  text-decoration: underline;
  cursor:pointer;
  background-color: transparent;
}

div * {
  margin: 10px;
}

</style>
