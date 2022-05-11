<!-- <template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
<template>
  <div id="app">
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      action=""
      :http-request="uploadFile"
      :on-change="handleChange"
      :on-remove="handleChange"
      :auto-upload="false"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>    
    </el-upload>
    <el-button
        style="margin-left: 10px;"
        size="small"
        type="success"
        @click="submitUpload"
      >上传到服务器</el-button>
    <div style="margin:0 auto;width: 75%;">
      <el-table
      :data="currentPageFiles"
      stripe
      style="width: 100%;">
        <el-table-column
          prop="filename"
          label="文件名"
          width="650">
          <template slot-scope="scope">
            <a :href="config.url+scope.row.filepath"
               target="_blank"
               class="TestCSS">{{scope.row.filename}}
            </a>
          </template>
        </el-table-column>     
        <el-table-column
          prop="createtime"
          label="上传时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="uploader"
          label="上传者"
          width="150">
        </el-table-column>
        <el-table-column
          label="操作">
          <div slot-scope="scope">          
            <el-button type="primary" size="small"
             @click="download_file(scope.row)">下载
            </el-button>
            <el-button type="danger" 
            @click="handleDel(scope.row)" 
            size="small">删除</el-button>
          </div>  
        </el-table-column>
      </el-table> 
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @current-change="pageChange"
          layout="prev, pager, next"
          :total="dataCnt">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="删除文件" :visible.sync="visible.handleDel" width="40%">
      <div>
        <el-button type="primary" @click="confirmDel">确认删除</el-button>
        <el-button @click="visible.handleDel = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import {postFiles,getFiles,deleteFiles,downloadFiles} from '../api/api.js';
import config from '../config/config';
export default {
  name: 'index',
  data () {
    return {
      show: false,
      request_data: {},
      uploadFileList: [],
      totalFiles: [],
      currentPageFiles: [],
      currentPage: 1,
      dataCnt: 0,
      config: config,
      visible: {
        handleDel: false
      },
      delItem: {
        filepath: ""
      }
    }
  },

  methods: {
    uploadFile(param){
      //只用来覆盖自动上传功能
    },
    errorhandle () {
      alert("登陆状态已过期，请重新登录")
      this.$router.push('/login')
    },
    handleChange(param,fileList){  
      console.log(fileList)
      this.uploadFileList = fileList
    },
    upload_callback(response){
      if (response.data.status == 'success'){
        this.$refs.upload.clearFiles()
        this.$message({
          message: '文件上传成功',
          type: 'success'
        });
        getFiles({},this.getFiles_callback,this.errorhandle)
      }else{
        alert(response.data.message)
      }
    },
    getFiles_callback(response){
      console.log(response)
      if (response.data.status == 'success'){
        this.totalFiles = response.data.files
        this.dataCnt = response.data.files.length
        this.showCurrentPageFiles()
      }else{
        alert(response.data.message)
      }
    },
    del_callback(response){
      if (response.data.status == 'success'){
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      }else{
        this.$message.error(response.data.message);
      }
      this.delItem = {
        filepath: ""
      }
      getFiles({},this.getFiles_callback,this.errorhandle)
    },
    pageChange(page){
      this.currentPage = page
      this.showCurrentPageFiles()    
    },
    showCurrentPageFiles(){
      this.currentPageFiles = this.totalFiles
      .slice((this.currentPage - 1)*10,this.currentPage*10)
    },
    submitUpload() {
      const formData = new FormData();
      this.uploadFileList.forEach(file => {
        formData.append("file", file.raw);
      });
      var configs = {headers:{'Content-Type':'multipart/form-data'}};        
      postFiles(formData,configs,this.upload_callback,this.errorhandle)
    },
    handleDel(row){
      console.log("1")
      this.visible.handleDel = true
      this.delItem = {
        filepath: row.filepath
      }
    },
    confirmDel() {
      this.visible.handleDel = false
      deleteFiles(this.delItem,this.del_callback,this.errorhandle)
    },
    download_file(row) {
      var requesturl = this.config.url+row.filepath
      var fileName = row.filename
      downloadFiles(requesturl,fileName,this.errorhandle)
    }
  },
  created() {
    getFiles({},this.getFiles_callback,this.errorhandle)
    console.log(this.config)
  },
  mounted () {
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
