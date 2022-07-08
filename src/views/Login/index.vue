<template>
  <div class="bgC">
    <div class="center">
      <el-input v-model="userName" type="text" placeholder="用户名" clearable @blur="onChangeName()" />
      <p class="Tips" v-show="usernameShow">用户名不能为空</p>
      <el-input class="topInterval" v-model="passWord" type="text" placeholder="密码" show-password @blur="onChangePass()" />
      <p class="Tips" v-show="passwordShow">密码不能为空</p>
      <p class="forgetPass">请使用上网账号登陆使用</p>
      <div class="onChage" @click="signIn()">登录</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SysLogin, initDimForeignTableRedis } from '@/api/api'
import { ElMessage } from 'element-plus'
import * as dd from 'dingtalk-jsapi'
import { useStore } from '@/store/index'
export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()
    const loginform = reactive({
      userName: '',
      passWord: '',
      usernameShow: false,
      passwordShow: false,
      UUid: '',
      time: 0
    })
    let onChangeName = () => {
      if (loginform.userName.length <= 0) {
        loginform.usernameShow = true
      } else {
        loginform.usernameShow = false
      }
    }
    let onChangePass = () => {
      if (loginform.passWord.length <= 0) {
        loginform.passwordShow = true
      } else {
        loginform.passwordShow = false
      }
    }

    let getUUID = () => {
      let uuid: any = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (c: any) => {
          return (c === 'x'
            ? (Math.random() * 16) | 0
            : ('r&0x3' as any) | ('0x8' as any)
          ).toString(16)
        }
      )
      loginform.UUid = uuid
    }
    let getTime = () => {
      let timestamp = new Date().getTime()
      loginform.time = timestamp
    }

    let signIn = async () => {
      const res: any = await SysLogin({
        username: loginform.userName,
        password: loginform.passWord,
        t: loginform.time,
        uuid: loginform.UUid
      })
      console.log('res: ', res)
      if (res.data.code === 0) {
        router.push({
          path: '/Main'
        })
        store.commit('changeMenuName', '')
        // 将用户token保存到vuex中
        store.commit('changeLogin', res.data.token)
      } else {
        ElMessage.error(res.data.msg)
        router.push({
          path: '/'
        })
      }
    }
    let initTableRedis = async () => {
      const res: any = await initDimForeignTableRedis()
      console.log('res:3333 ', res)
    }
    if (dd.env.platform !== 'notInDingTalk') {
      //钉钉内打开
      router.push({
        path: '/Main'
      })
    }
    onMounted(() => {
      getUUID()
      getTime()
    })
    return {
      ...toRefs(loginform),
      onChangeName,
      onChangePass,
      signIn
    }
  }
})
</script>
<style lang="scss" scoped>
.bgC {
  width: 100%;
  height: 100%;
  background: url('../../static/image/bg.png');
  display: flex;
  align-items: center;
  justify-content: center;
}
.center {
  width: 30%;
  height: 40%;
  // background-color: #fff;
  border-radius: 10px;
  margin: auto;
}
.topInterval {
  margin-top: 5%;
}
.onChage {
  width: 100%;
  line-height: 40px;
  background-color: #1e90ff;
  text-align: center;
  border-radius: 10px;
  color: #fff;
  margin-top: 2%;
  cursor: pointer;
}
.forgetPass {
  text-align: center;
  font-size: 12px;
  color: #2093f7;
  cursor: pointer;
  margin-top: 16%;
  cursor: pointer;
}
.Tips {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}
@media only screen and (max-width: 767px) {
  .center {
    width: 80%;
    height: 30%;
  }
}
</style>