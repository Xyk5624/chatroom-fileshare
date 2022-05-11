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
    <div class="files-preview">
      <div style="margin-bottom: 20px; font-size: 20px;">上传文件(一次最多上传4个文件)</div>
      <van-uploader v-model="fileList" multiple :max-count="4" :deletable="false" :preview-size="70" />
      <div>
        <van-button type="info" @click="afterRead">点击上传</van-button>
      </div>
    </div>

    <!-- <el-upload class="upload-demo" ref="upload" drag action="" :http-request="uploadFile" :on-change="handleChange"
      :on-remove="handleChange" :auto-upload="false" multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
    <div style="padding:20px; font-size: 20px;">文件列表</div>
    <van-cell-group>
      <van-swipe-cell v-for="item in currentPageFiles" :key="item.filename">
        <a :href="config.url+item.filepath" target="_blank" class="link">
          <van-cell value-class="file-link" :border="false" :value="item.filename" />
        </a>
        <template #right>
          <van-button square type="info" text="详细信息" @click="showDetail(item.uploader,item.createtime)" />
          <van-button square type="primary" text="下载" @click="download_file(item.filepath,item.filename)" />
          <van-button v-if="username == item.uploader" square type="danger" text="删除" @click="handleDel(item.filepath)" />
        </template>
      </van-swipe-cell>
    </van-cell-group>
    <van-pagination v-model="currentPage" :total-items="dataCnt" :items-per-page="10" @change="pageChange" />
    <!-- <div style="margin:0 auto;width: 75%;">
      <el-table :data="currentPageFiles" stripe style="width: 100%;">
        <el-table-column prop="filename" label="文件名" width="650">
          <template slot-scope="scope">
            <a :href="config.url+scope.row.filepath" target="_blank" class="TestCSS">{{scope.row.filename}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="上传时间" width="200">
        </el-table-column>
        <el-table-column prop="uploader" label="上传者" width="150">
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="scope">
            <el-button type="primary" size="small" @click="download_file(scope.row)">下载
            </el-button>
            <el-button type="danger" @click="handleDel(scope.row)" size="small">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination @current-change="pageChange" layout="prev, pager, next" :total="dataCnt">
        </el-pagination>
      </div>
    </div> -->
    <!-- <el-dialog title="删除文件" :visible.sync="visible.handleDel" width="40%">
      <div>
        <el-button type="primary" @click="confirmDel">确认删除</el-button>
        <el-button @click="visible.handleDel = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
  import axios from 'axios'
  import { postFiles, getFiles, deleteFiles, downloadFiles } from '../api/api.js';
  import config from '../config/config';
  export default {
    name: 'index',
    // components: {
    //   [Dialog.Component.name]: Dialog.Component,
    // },
    data() {
      return {
        username: this.$cookies.get('username'),
        show: false,
        request_data: {},
        uploadFileList: [],
        fileList: [],
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
      afterRead() {
        console.log("1")
        const formData = new FormData();
        this.fileList.forEach(file => {
          formData.append("file", file.file);
        });
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        postFiles(formData, configs, this.upload_callback, this.errorhandle)
      },
      errorhandle() {
        this.$toast.fail("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      handleChange(param, fileList) {
        console.log(fileList)
        this.uploadFileList = fileList
      },
      upload_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success('文件上传成功')
          this.fileList = []
          getFiles({}, this.getFiles_callback, this.errorhandle)
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      getFiles_callback(response) {
        if (response.data.status == 'success') {
          this.totalFiles = response.data.files
          this.dataCnt = response.data.files.length
          this.showCurrentPageFiles()
          console.log(this.totalFiles)
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      del_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success('删除成功')
        } else {
          this.$toast.fail(response.data.message)
        }
        this.delItem = {
          filepath: ""
        }
        getFiles({}, this.getFiles_callback, this.errorhandle)
      },
      pageChange(page) {
        this.currentPage = page
        this.showCurrentPageFiles()
      },
      showCurrentPageFiles() {
        this.currentPageFiles = this.totalFiles
          .slice((this.currentPage - 1) * 10, this.currentPage * 10)
      },
      // submitUpload() {
      //   const formData = new FormData();
      //   this.uploadFileList.forEach(file => {
      //     formData.append("file", file.raw);
      //   });
      //   var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
      //   postFiles(formData, configs, this.upload_callback, this.errorhandle)
      // },
      handleDel(filepath) {
        this.$dialog.confirm({
          title: '删除文件',
          message: '确认删除该文件吗',
        })
          .then(() => {
            this.delItem = {
              filepath: filepath
            }
            deleteFiles(this.delItem, this.del_callback, this.errorhandle)
          })
          .catch(() => {
            // on cancel
          });
      },
      confirmDel() {
        this.visible.handleDel = false
        deleteFiles(this.delItem, this.del_callback, this.errorhandle)
      },
      download_file(filepath, filename) {
        var requesturl = this.config.url + filepath
        var fileName = filename
        downloadFiles(requesturl, fileName, this.errorhandle)
      },
      showDetail(uploader, createtime) {
        var detailText = `上传者: ${uploader}
        上传时间: ${createtime}`
        this.$dialog.alert({
          message: detailText,
        }).then(() => {
          // on close
        });
      }
    },
    created() {
      getFiles({}, this.getFiles_callback, this.errorhandle)
      console.log(this.config)
    },
    mounted() {
    }
  }
</script>

<style>
  body {
    font-family: Helvetica, sans-serif;
  }

  .files-preview {
    width: 80%;
    margin: 0 auto;
  }

  .file-link {
    color: rgb(0, 174, 255);
    text-decoration: underline;
  }
</style>