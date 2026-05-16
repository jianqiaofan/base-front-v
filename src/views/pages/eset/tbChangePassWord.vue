<template>
  <div id="app-container">
    <h2>{{ name }}</h2>
    <span>请输入新密码:</span>
    <input type="password" style="width:150px" v-model="passWord1"><br>
    <span>请确认新密码:</span>
    <input type="password" style="width:150px" v-model="passWord2">
    <button @click="changePassword">修改密码</button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'tbChangePassword',
  components: {},
  data() {
    return {
      passWord1: '',
      passWord2: ''
    }

  },
  computed: {
    ...
      mapGetters([
        'name'
      ])
  },
  methods: {
    changePassword() {
      if (this.passWord1.trim().length === 0) {
        alert('密码不能为空!!!')
        return
      } else if (this.passWord1 !== this.passWord2) {
        alert('两次密码不相同!!!')
        return
      } else {
        this.fetchChangePassword()
      }
    },
    fetchChangePassword() {
      //获取方案资料
      fetch(process.env.VUE_APP_BASE_API + '/api/changeMyPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': getToken()// 添加Authorization字段，使用Bearer认证方式
        },
        body: JSON.stringify({ username: this.name, newPassword: this.passWord1 })
      })
        .then(response => {
          // 确保服务器响应为成功状态码
          if (response.ok) {
            // 获取响应体中的JSON数据
            alert('密码修改成功！！！')
            return
          } else {
            // 如果响应状态码不是2xx，抛出错误
            throw new Error('Something went wrong on server side.')
          }
        })
        .then(r => {

        })
        .catch(error => {
          // 捕捉fetch过程中或处理响应时的错误
          console.error('Error:', error)
        })
    }
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
  width: 300px; /* 限制容器宽度不超过屏幕宽度 */
  overflow-x: auto; /* 当内容宽度超过容器宽度时显示水平滚动条 */
}

div * {
  margin: 10px;
}

</style>
