<template>
  <div class="bgC">
    <div class="center">
      <el-input
        v-model="userName"
        type="text"
        placeholder="用户名"
        clearable
        @blur="onChangeName()"
      />
      <p class="Tips" v-show="usernameShow">用户名不能为空</p>
      <el-input
        class="topInterval"
        v-model="passWord"
        type="text"
        placeholder="密码"
        show-password
        @blur="onChangePass()"
      />
      <p class="Tips" v-show="passwordShow">密码不能为空</p>
      <p class="forgetPass">请使用上网账号登陆使用</p>
      <div class="onChage" @click="signIn()">登录</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const loginform = reactive({
      userName: "",
      passWord: "",
      usernameShow: false,
      passwordShow: false,
      UUid: "",
      time: 0,
    });
    let onChangeName = () => {
      if (loginform.userName.length <= 0) {
        loginform.usernameShow = true;
      } else {
        loginform.usernameShow = false;
      }
    };
    let onChangePass = () => {
      if (loginform.passWord.length <= 0) {
        loginform.passwordShow = true;
      } else {
        loginform.passwordShow = false;
      }
    };

    let getUUID = () => {
      let uuid: any = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (c) => {
          return (
            c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8"
          ).toString(16);
        }
      );
      loginform.UUid = uuid;
    };
    let getTime = () => {
      let timestamp = new Date().getTime();
      console.log(timestamp);
      loginform.time = timestamp;
    };

    let signIn = async () => {
      console.log("loginform", loginform);

      axios
        .post("http://tech.9f.cn/canary-admin/sys/login", {
          username: loginform.userName,
          password: loginform.passWord,
          t: loginform.time,
          uuid: loginform.UUid,
        })
        .then(function (ret) {
          if (ret.data) {
            router.push({
              path: "/Main",
              query:{
                  userId:1130
              }
            });
          }
          localStorage.setItem("token",ret.data.token);
        });
    };
    onMounted(() => {
      getUUID();
      getTime();
    });
    return {
      ...toRefs(loginform),
      onChangeName,
      onChangePass,
      signIn,
    };
  },
});
</script>
<style lang="scss" scoped>
.bgC {
  width: 100%;
  height: 100%;
  background: url("../../static/image/bg.png");
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