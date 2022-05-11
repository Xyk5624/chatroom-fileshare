<template>
  <div id="app">
    <div class="page_background">
      <van-cell-group>
        <van-cell center size="large">
          <template #title>
            <van-image round width="100px" height="100px" :src="imageUrl" />
            <div class="userinfo">
              <div style="font-size: 40px;">{{username}}</div>
              <br>
              <div style="font-size: 15px; color: grey;">邮箱:{{passwordForm.email}}</div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group title=" ">
        <van-cell title="修改头像" is-link @click="avatarVisible = true"/>
        <van-cell title="修改密码" is-link @click="passwordVisible = true"/>
      </van-cell-group>
      <van-cell-group title=" ">
        <van-cell title="登出" is-link @click="onLogout"/>
      </van-cell-group>
    </div>
    <van-overlay :show="avatarVisible" @click="avatarVisible = false">
      <div class="wrapper" @click.stop>
        <div class="avatar_dialog_block">
          <van-button round type="default" icon="cross" class="cross_btn" @click="avatarVisible = false"></van-button>
          <div class="dialog_title">修改头像</div>
          <div>
            <van-uploader v-model="fileList" :max-count="1" :after-read="afterRead" :before-read="beforeAvatarUpload"
              :deletable="false" :preview-size="158" style="margin-left:8px;" />
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="passwordVisible" @click="passwordVisible = false">
      <div class="wrapper" @click.stop>
        <div class="password_dialog_block">
          <van-button round type="default" icon="cross" class="cross_btn" @click="passwordVisible = false">
          </van-button>
          <div class="dialog_title">修改密码</div>
          <div>
            <van-form @submit="submitPassword">
              <van-field v-model="passwordForm.username" name="用户名" label="用户名" readonly />
              <van-field v-model="passwordForm.email" name="邮箱" label="邮箱" readonly>
                <template #button>
                  <van-button native-type="button" type="info" size="small" :disabled="isCodeSend" @click="sendCode">
                    {{sendCodeText}}
                  </van-button>
                </template>
              </van-field>
              <van-field v-model="passwordForm.code" name="验证码" label="验证码"
                :rules="[{ required: true, message: '请输入邮箱验证码' }, { validator: codeValidator, message: '验证码为6位'}]" />
              <van-field v-model="passwordForm.password" name="新密码" label="新密码"
                :rules="[{ required: true, message: '请输入新密码' }, { validator: passwordValidator, message: '密码长度在6到16个字符'}]" />
              <van-field v-model="passwordForm.repeatPassword" name="重复密码" label="重复密码"
                :rules="[{ required: true, message: '请重复输入新密码' }, { validator: repeatPasswordValidator, message: '两次密码不相同'}]" />
              <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
              </div>
            </van-form>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
  import { deleteSession, getPossword, putPassword, getUser, putAvatar } from '../api/api.js';
  import config from '../config/config';
  export default {
    name: 'Index',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value !== this.passwordForm.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      };
      return {
        config: config,
        passwordVisible: false,
        avatarVisible: false,
        username: "",
        passwordForm: {
          username: "",
          email: "",
          code: "",
          password: "",
          repeatPassword: ""
        },
        imageUrl: "",
        fileList: [],
        isCodeSend: false,
        sendCodeText: "发送验证码",
        timer: null,
        counter: 60,
      }
    },
    methods: {
      init() {
        this.username = this.$cookies.get('username')
        getUser({}, this.getUser_callback, this.errorhandle)
        this.passwordForm.username = this.$cookies.get('username')
      },
      errorhandle() {
        this.$toast.fail("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      getUser_callback(response) {
        if (response.data.status == 'success') {
          var userdata = response.data.user[0]
          this.passwordForm.email = userdata.email
          this.imageUrl = userdata.avatar ? this.config.url + userdata.avatar : require("../assets/userImg.png");
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      afterRead(file) {
        const formData = new FormData();
        formData.append("file", file.file);
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        putAvatar(formData, configs, this.uploadAvatar_callback, this.errorhandle)
        this.imageUrl = URL.createObjectURL(file.file)
      },
      uploadAvatar_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          // this.imageUrl = this.config.url + response.data.filepath
          console.log(this.imageUrl)
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$toast.fail('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$toast.fail('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      logout_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          this.$cookies.remove('username');
          this.$cookies.remove('email');
          this.$router.push('/login')
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      sendCode_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success('验证码发送成功')
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      submitPassword_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          this.$toast.success('密码修改成功')
          this.passwordVisible = false
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      onLogout() {
        deleteSession(this.logout_callback, this.errorhandle)
      },
      countDown() {
        this.timer = setInterval(() => {
          this.sendCodeText = `${this.counter}秒后重发`
          this.counter--
          if (this.counter <= 0) {
            clearInterval(this.timer)
            this.isCodeSend = false
            this.sendCodeText = '发送验证码'
          }
        }, 1000)
      },
      sendCode() {
        getPossword({ email: this.passwordForm.email }, this.sendCode_callback, this.errorhandle)
        this.isCodeSend = true
        this.countDown()
      },
      codeValidator(val) {
        return val.length == 6
      },
      passwordValidator(val) {
        return val.length >= 6 && val.length <= 16
      },
      repeatPasswordValidator(val) {
        return val == this.passwordForm.password
      },
      submitPassword() {
        putPassword(this.passwordForm, this.submitPassword_callback, this.errorhandle)
      },
      goIndex() {
        this.$router.push("/")
      }
    },
    created() {
      this.init()
    }
  }
</script>

<style>
  body {
    font-family: Helvetica, sans-serif;
  }

  .page_background {
    position: absolute;
    background-color: rgb(206, 206, 206);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .userinfo {
    display:inline-block; 
    position:relative; 
    bottom: 20px; 
    left: 20px;  
    text-align: left;
  }

  .avatar_dialog_block {
    width: 300px;
    height: 400px;
    background-color: #fff;
  }

  .password_dialog_block {
    width: 500px;
    height: 650px;
    background-color: #fff;
  }

  .cross_btn {
    border: none;
    float: right;
  }

  .dialog_title {
    font-size: 15px;
    margin-bottom: 20px;
    clear: both;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>