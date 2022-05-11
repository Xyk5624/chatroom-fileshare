<template>
  <div id="app">
    <h1>群组空间</h1>
    <h2>
      <van-button type="info" @click="visible.manageMember = true">管理群组成员</van-button>
    </h2>
    <h2>群组文件</h2>
    <div style="margin-bottom: 20px; font-size: 20px;"></div>
      <van-uploader v-model="fileList" multiple :max-count="4" :deletable="false" :preview-size="70" />
      <div>
        <van-button type="info" @click="afterRead">点击上传</van-button>
      </div>
    <van-cell-group>
      <van-swipe-cell v-for="item in currentPageFiles" :key="item.filepath">
        <a :href="config.url+item.filepath" target="_blank" class="link">
          <van-cell value-class="file-link" :border="false" :value="item.filename" />
        </a>
        <template #right>
          <van-button square type="info" text="详细信息" @click="showDetail(item.uploader,item.createtime)" />
          <van-button square type="primary" text="下载" @click="download_file(item.filepath,item.filename)" />
          <van-button v-if="username == item.uploader" square type="danger" text="删除" @click="handleDelFile(item.filepath)" />
        </template>
      </van-swipe-cell>
    </van-cell-group>
    <van-pagination v-model="currentMemberPage" :total-items="dataCnt" :items-per-page="10" @change="pageChange" />
    <van-overlay :show="visible.manageMember" @click="visible.manageMember = false">
      <div class="wrapper" @click.stop>
        <div class="manageMember_dialog_block">
          <van-button round type="default" icon="cross" class="cross_btn" @click="visible.manageMember = false">
          </van-button>
          <div class="dialog_title">管理群组成员</div>
          <van-button type="info" @click="visible.handleNewUser = true">邀请成员</van-button>
          <van-cell-group>
            <van-swipe-cell v-for="item in currentGroupMembers" :key="item.username">
              <van-cell :border="false" :value="item.username" />
              <template #right>
                <div v-if="item.username != username && groupCreator === username">
                  <van-button square type="danger" text="踢出" @click="handleDelUser(item)" />
                </div>
              </template>
            </van-swipe-cell>
          </van-cell-group>
          <van-pagination v-model="currentPage" :total-items="memberCnt" :items-per-page="10"
            @change="memberPageChange" />

          <!-- <van-form @submit="confirmNew">
            <van-field v-model="newItem.groupname" name="群组名" label="群组名"
              :rules="[{ required: true, message: '请填写群组名' }]" />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
          </van-form> -->
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="visible.handleNewUser" @click="visible.handleNewUser = false">
      <div class="wrapper" @click.stop>
        <div class="new_dialog_block">
          <van-button round type="default" icon="cross" class="cross_btn" @click="visible.handleNewUser = false">
          </van-button>
          <div class="dialog_title">邀请成员</div>
          <van-form @submit="confirmNewUser">
            <van-field v-model="newUserItem.username" name="用户名" label="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]" />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-overlay>

    <!-- <div class="group-container">
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
    </el-dialog> -->
  </div>
</template>
<script>
  import { getGroupUser, postGroupUser, deleteGroupUser } from '../api/api.js';
  import { postGroupFiles, getGroupFiles, deleteGroupFiles, downloadFiles } from '../api/api.js';
  import config from '../config/config';
  export default {
    name: 'group',
    data() {
      return {
        username: this.$cookies.get('username'),
        groupName: "",
        groupCreator: "",
        fileList: [],
        uploadFileList: [],
        totalFiles: [],
        currentPageFiles: [],
        currentPage: 1,
        currentMemberPage: 1,
        totalGroupMembers: [],
        currentGroupMembers: [],
        dataCnt: 0,
        memberCnt: 0,
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
          manageMember: false,
          handleNewUser: false,
          handleDelUser: false,
          handleDelFile: false
        },
      }
    },

    methods: {
      errorhandle() {
        this.$toast.fail("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      afterRead() {
        const formData = new FormData();
        this.fileList.forEach(file => {
          formData.append("file", file.file);
        });
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        postGroupFiles(this.$route.params.groupid, formData, configs, this.upload_callback, this.errorhandle)
      },
      enterGroupChat() {
        this.$router.push('/group/' + this.$route.params.groupid + '/chat')
      },
      upload_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success("文件上传成功")
          this.fileList = []
          getGroupFiles(this.$route.params.groupid, {}, this.getFiles_callback, this.errorhandle)
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      getFiles_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          this.totalFiles = response.data.files
          this.dataCnt = response.data.files.length
          this.showCurrentPageFiles()
        } else {
          this.$toast.fail(response.data.message)
        }
      },
      delFile_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success("删除成功")
        } else {
          this.$toast.fail(response.data.message);
        }
        this.delItem = {
          filepath: ""
        }
        getGroupFiles(this.$route.params.groupid, {}, this.getFiles_callback, this.errorhandle)
      },
      pageChange(page) {
        this.currentPage = page
        this.showCurrentPageFiles()
      },
      showCurrentPageFiles() {
        this.currentPageFiles = this.totalFiles
          .slice((this.currentPage - 1) * 10, this.currentPage * 10)
      },
      handleDelFile(filepath) {
        this.$dialog.confirm({
          title: '删除文件',
          message: '确认删除该文件吗',
        })
          .then(() => {
            this.delFileItem = {
              filepath: filepath
            }
            deleteGroupFiles(this.$route.params.groupid, this.delFileItem, this.delFile_callback, this.errorhandle)
          })
          .catch(() => {
            // on cancel
          });
      },
      download_file(filepath, filename) {
        var requesturl = this.config.url + filepath
        // var fileName = filename
        downloadFiles(requesturl, filename, this.errorhandle)
      },
      memberPageChange(page) {
        this.currentMemberPage = page
        this.showCurrentMemberPage()
      },
      showCurrentMemberPage() {
        this.currentGroupMembers = this.totalGroupMembers
          .slice((this.currentMemberPage - 1) * 10, this.currentMemberPage * 10)
      },
      getGroupUser_callback(response) {
        console.log(response)
        if (response.data.status == 'success') {
          this.totalGroupMembers = response.data.members
          this.memberCnt = this.totalGroupMembers.length
          this.groupName = response.data.groupinfo[0].groupname
          this.groupCreator = response.data.groupinfo[0].creator
          this.showCurrentMemberPage()
        } else {
          this.$toast.fail(response.data.message);
        }
      },
      newUser_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success("邀请成功")
        } else {
          this.$toast.fail(response.data.message);
        }
        this.newUserItem = {
          username: ""
        }
        getGroupUser(this.$route.params.groupid, this.getGroupUser_callback, this.errorhandle)
      },
      delUser_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success("踢出成功")
        } else {
          this.$toast.fail(response.data.message);
        }
        this.delUserItem = {
          userid: 0
        }
        getGroupUser(this.$route.params.groupid, this.getGroupUser_callback, this.errorhandle)
      },
      confirmNewUser() {
        this.visible.handleNewUser = false
        postGroupUser(this.$route.params.groupid, this.newUserItem, this.newUser_callback, this.errorhandle)
      },
      handleDelUser(row) {
        this.$dialog.confirm({
          title: '踢出成员',
          message: '确认踢出该成员吗',
        })
          .then(() => {
            this.delUserItem = {
              userid: row.userid
            }
            deleteGroupUser(this.$route.params.groupid, this.delUserItem, this.delUser_callback, this.errorhandle)
          })
          .catch(() => {
            // on cancel
          });
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
      console.log(this.$route.params.groupid)
      getGroupUser(this.$route.params.groupid, this.getGroupUser_callback, this.errorhandle)
      getGroupFiles(this.$route.params.groupid, {}, this.getFiles_callback, this.errorhandle)
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

  .manageMember_dialog_block {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .new_dialog_block {
    width: 500px;
    height: 350px;
    background-color: #fff;
  }

  .cross_btn {
    border: none;
    float: right;
  }

  .dialog_title {
    font-size: 0.8rem;
    margin-bottom: 20px;
    clear: both;
  }
</style>