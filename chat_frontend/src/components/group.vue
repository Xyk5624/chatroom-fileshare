<template>
  <div id="app">
    <div class="group-container">
      <div class="group-leftcontainer">
        <h2>群组文件</h2>
        <el-upload class="upload-demo" ref="upload" drag action="" :http-request="uploadFile" :on-change="handleChange"
          :on-remove="handleChange" :auto-upload="false" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div style="margin:0 auto;width: 90%;">
          <el-table :data="currentPageFiles" stripe style="width: 100%;">
            <el-table-column prop="filename" label="文件名" width="650">
              <template slot-scope="scope">
                <a :href="config.url+'/group'+scope.row.filepath" target="_blank" class="TestCSS">{{scope.row.filename}}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="createtime" label="上传时间" width="200">
            </el-table-column>
            <el-table-column prop="uploader" label="上传者" width="80">
            </el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button type="primary" size="small" @click="download_file(scope.row)">下载
                </el-button>
                <div v-if="scope.row.uploader == username">
                  <el-button type="danger" @click="handleDelFile(scope.row)" size="small">删除</el-button>
                </div>               
              </div>
            </el-table-column>
          </el-table>
          <div class="block">
            <span class="demonstration"></span>
            <el-pagination @current-change="pageChange" layout="prev, pager, next" :total="dataCnt">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="group-rightcontainer">
        <h2>群组成员</h2>
        <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="visible.handleNewUser = true">邀请
        </el-button>
        <el-table :data="groupMembers" stripe style="width: 100%;">
          <el-table-column prop="username" label="用户名">
          </el-table-column>
          <el-table-column v-if="groupCreator === username" label="操作">
            <div slot-scope="scope" v-if="scope.row.username != username">
              <el-button type="danger" @click="handleDelUser(scope.row)" size="small">踢出</el-button>
            </div>
          </el-table-column>
        </el-table>
        <!-- <el-button type="primary" style="margin-top:10vh;" @click="enterGroupChat">进入群组聊天</el-button> -->
      </div>

    </div>
    <el-dialog title="邀请成员" :visible.sync="visible.handleNewUser" width="40%">
      <el-form :model="newUserItem" ref="newForm" v-bind:rules="newFormRules">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="newUserItem.username"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="confirmNewUser">确认邀请</el-button>
        <el-button @click="visible.handleNewUser = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="踢出用户" :visible.sync="visible.handleDelUser" width="40%">
      <div>
        <el-button type="primary" @click="confirmDelUser">确认踢出</el-button>
        <el-button @click="visible.handleDelUser = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除文件" :visible.sync="visible.handleDelFile" width="40%">
      <div>
        <el-button type="primary" @click="confirmDelFile">确认删除</el-button>
        <el-button @click="visible.handleDelFile = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getGroupUser, postGroupUser, deleteGroupUser } from '../api/api.js';
  import { postGroupFiles, getGroupFiles, deleteGroupFiles,downloadFiles } from '../api/api.js';
  import config from '../config/config';
  export default {
    name: 'group',
    data() {
      return {
        username: this.$cookies.get('username'),
        groupName: "",
        groupCreator: "",
        groupMembers: [],
        uploadFileList: [],
        totalFiles: [],
        currentPageFiles: [],
        currentPage: 1,
        dataCnt: 0,
        config: config,
        newUserItem: {
          username: ""
        },
        delUserItem: {
          userid: 0
        },
        delFileItem: {
          filepath: ""
        },
        visible: {
          handleNewUser: false,
          handleDelUser: false,
          handleDelFile: false
        },
        newFormRules: {
          username: [
            { required: true, trigger: "blur", message: "请输入用户名" },
          ]
        }
      }
    },

    methods: {
      errorhandle() {
        alert("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      enterGroupChat(){
        this.$router.push('/group/'+this.$route.params.groupid+'/chat')
      },
      uploadFile(param) {
        //只用来覆盖自动上传功能
      },
      handleChange(param, fileList) {
        console.log(fileList)
        this.uploadFileList = fileList
      },
      upload_callback(response) {
        if (response.data.status == 'success') {
          this.$refs.upload.clearFiles()
          this.$message({
            message: '文件上传成功',
            type: 'success'
          });
          getGroupFiles(this.$route.params.groupid,{}, this.getFiles_callback, this.errorhandle)
        } else {
          alert(response.data.message)
        }
      },
      getFiles_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          this.totalFiles = response.data.files
          this.dataCnt = response.data.files.length
          this.showCurrentPageFiles()
        } else {
          alert(response.data.message)
        }
      },
      delFile_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.delItem = {
          filepath: ""
        }
        getGroupFiles(this.$route.params.groupid,{}, this.getFiles_callback, this.errorhandle)
      },
      pageChange(page) {
        this.currentPage = page
        this.showCurrentPageFiles()
      },
      showCurrentPageFiles() {
        this.currentPageFiles = this.totalFiles
          .slice((this.currentPage - 1) * 10, this.currentPage * 10)
      },
      submitUpload() {
        const formData = new FormData();
        this.uploadFileList.forEach(file => {
          formData.append("file", file.raw);
        });
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        postGroupFiles(this.$route.params.groupid,formData, configs, this.upload_callback, this.errorhandle)
      },
      handleDelFile(row) {
        console.log("1")
        this.visible.handleDelFile = true
        this.delFileItem = {
          filepath: row.filepath
        }
      },
      confirmDelFile() {
        this.visible.handleDelFile = false
        deleteGroupFiles(this.$route.params.groupid,this.delFileItem, this.delFile_callback, this.errorhandle)
      },
      download_file(row) {
        var requesturl = this.config.url + row.filepath
        var fileName = row.filename
        downloadFiles(requesturl, fileName, this.errorhandle)
      },
      getGroupUser_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          this.groupMembers = response.data.members
          this.groupName = response.data.groupinfo[0].groupname
          this.groupCreator = response.data.groupinfo[0].creator
        } else {
          this.$message.error(response.data.message);
        }
      },
      newUser_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '邀请成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.newUserItem = {
          username: ""
        }
        getGroupUser(this.$route.params.groupid, this.getGroupUser_callback, this.errorhandle)
      },
      delUser_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '踢出成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.delUserItem = {
          userid: 0
        }
        getGroupUser(this.$route.params.groupid, this.getGroupUser_callback, this.errorhandle)
      },
      confirmNewUser() {
        this.$refs.newForm.validate(valid => {
          if (!valid) {
            this.$message.error('请输入用户名')
          } else {
            this.visible.handleNewUser = false
            postGroupUser(this.$route.params.groupid, this.newUserItem, this.newUser_callback, this.errorhandle)
          }
        })
      },
      handleDelUser(row) {
        this.visible.handleDelUser = true
        this.delUserItem = {
          userid: row.userid
        }
      },
      confirmDelUser() {
        this.visible.handleDelUser = false
        deleteGroupUser(this.$route.params.groupid, this.delUserItem, this.delUser_callback, this.errorhandle)
      },
    },
    created() {
      console.log(this.$route.params.groupid)
      getGroupUser(this.$route.params.groupid, this.getGroupUser_callback, this.errorhandle)
      getGroupFiles(this.$route.params.groupid,{}, this.getFiles_callback, this.errorhandle)
    }
  }
</script>

<style>
  h2 {
    font-weight: normal;
  }

  .tablecontainer {
    margin: 0 auto;
    /* width: 50%; */
  }

  .group-container {
    width: 100%;
    margin: 0 auto;
    display: flex;
  }

  .group-leftcontainer {
    width: 70%;
  }

  .group-rightcontainer {
    padding-right: 100px;
    width: 30%;
  }
</style>