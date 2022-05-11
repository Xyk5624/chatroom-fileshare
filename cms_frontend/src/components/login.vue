<template>
    <div class="container">
        <img src="../assets/logo.png">
        <el-form ref="form" :model="form" label-width="80px" labelPosition='right'>
            <el-form-item label="用户名">
                <el-col :span="20">
                    <el-input v-model="form.username"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="密码">
                <el-col :span="20">
                    <el-input type="password" class="form_input" v-model="form.password"></el-input>
                </el-col>
                </el-form-item>
            <div class="form_buttons">
                <el-button type="primary" @click="onSubmit">登录</el-button>
                <el-button>取消</el-button>
            </div>           
        </el-form>
    </div>      
  </template>
  <script>
  import {postSession} from '../api/api.js';
  export default {
    name: 'login',
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit() {
        postSession(this.form,this.login_callback)
      },
      login_callback(response){
        console.log(response)
        if (response.data.status == 'success'){
          this.$cookies.set('username', response.data.username, 60 * 60 * 24 * 7)
          this.$router.push('/')
        }else{
          alert(response.data.message)
        }
      }
    }
  }
  </script>
  
  <style>
  body {
    font-family: Helvetica, sans-serif;
  }
  .container {
    margin:0 auto;
    width: 500px;
    text-align: center;
  }
  
  </style>
  