<template>
  <el-container>
    <el-header>
      <!-- <div v-if="this.$route.name != 'Login'"> -->
      <el-menu mode="horizontal">
        <el-row :gutter="30" style="display:flex;align-items:center;">
          <el-col :span="1">
            <el-button @click="goIndex">首页</el-button>
          </el-col>
          <el-col :span="3" :offset="16" style="display: flex; align-items: center;">
            Welcome {{username}}
            <a href="" @click.prevent="avatarVisible = true"><img :src="imageUrl"
                style="height: 40px;border-radius: 50%" /></a>
          </el-col>
          <el-col :span="2">
            <el-button @click="passwordVisible = true">修改密码</el-button>
          </el-col>
          <el-col :span="1">
            <el-button @click="onLogout">登出</el-button>
          </el-col>
        </el-row>
      </el-menu>
      <el-dialog title="修改密码" :visible.sync="passwordVisible" width="40%">
        <el-form ref="passwordForm" :model="passwordForm" v-bind:rules="formRules" label-width="80px"
          labelPosition='right'>
          <el-form-item label="用户名">
            <el-col :span="20">
              <span>{{passwordForm.username}}</span>
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-col :span="16">
              <span>{{passwordForm.email}}</span>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="sendCode">发送验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-col :span="24">
              <el-input v-model="passwordForm.code"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-col :span="24">
              <el-input type="password" v-model="passwordForm.password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="重复密码" prop="repeatPassword">
            <el-col :span="24">
              <el-input type="password" v-model="passwordForm.repeatPassword"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passwordVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitPassword">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改头像" :visible.sync="avatarVisible" width="40%">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadAvatar"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-dialog>
    </el-header>
    <el-main>
      <router-view :imageUrl="imageUrl" />
    </el-main>
  </el-container>
</template>

<script>
  import { deleteSession, getPossword, putPassword, getUser, putAvatar } from '../api/api.js';
  import config from '../config/config';
  export default {
    name: 'BasePage',
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
        formRules: {
          code: [
            { required: true, trigger: "blur", message: "请输入密码" },
            {
              min: 6,
              max: 6,
              message: "验证码长度为6位",
              trigger: "blur",
            },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 6,
              max: 16,
              message: "长度在 6 到 16 个字符",
              trigger: "blur",
            },
            { validator: validatePass, trigger: "blur" },
          ],
          repeatPassword: [
            { required: true, message: "请确认密码", trigger: "blur" },
            {
              min: 6,
              max: 16,
              message: "长度在 6 到 16 个字符",
              trigger: "blur",
            },
            { validator: validatePass, trigger: "blur", required: true },
          ],
        },
      }
    },
    methods: {
      init() {
        this.username = this.$cookies.get('username')
        getUser({}, this.getUser_callback, this.errorhandle)
        this.passwordForm.username = this.$cookies.get('username')
      },
      errorhandle() {
        alert("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      getUser_callback(response) {
        if (response.data.status == 'success') {
          var userdata = response.data.user[0]
          this.passwordForm.email = userdata.email
          this.imageUrl = userdata.avatar ? this.config.url + userdata.avatar : require("../assets/userImg.png");
        } else {
          alert(response.data.message)
        }
      },
      uploadAvatar(param) {
        const formData = new FormData();
        formData.append("file", param.file);
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        putAvatar(formData, configs, this.uploadAvatar_callback, this.errorhandle)
        console.log(param.file)
        this.imageUrl = URL.createObjectURL(param.file);
      },
      uploadAvatar_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          // this.imageUrl = this.config.url + response.data.filepath
          console.log(this.imageUrl)
        } else {
          alert(response.data.message)
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
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
          alert(response.data.message)
        }
      },
      sendCode_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '验证码发送成功',
            type: 'success'
          });
        } else {
          alert(response.data.message)
        }
      },
      submitPassword_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          alert("密码修改成功")
          this.passwordVisible = false
        } else {
          alert(response.data.message)
        }
      },
      onLogout() {
        deleteSession(this.logout_callback, this.errorhandle)
      },
      sendCode() {
        getPossword({ email: this.passwordForm.email }, this.sendCode_callback, this.errorhandle)
      },
      submitPassword() {
        this.$refs.passwordForm.validate(valid => {
          if (!valid) {
            this.$message.error('请按要求填写后再提交')
          } else {
            putPassword(this.form, this.submitPassword_callback, this.errorhandle)
          }
        })
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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