<template>
  <div id="app">
    <h2>群组</h2>
    <div class="tablecontainer">
      <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="visible.handleNew = true">新建群组
      </el-button>
      <el-table :data="currentGroupsData" stripe style="width: 100%;">
        <el-table-column prop="groupname" label="群组名" width="180">
        </el-table-column>
        <el-table-column prop="creator" label="群组创建者" width="180">
        </el-table-column>
        <el-table-column prop="createtime" label="群组创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="scope">
            <el-button type="primary" @click="handleEnter(scope.row)" size="small">进入群组空间</el-button>
            <el-button type="danger" v-if="scope.row.creator == username" @click="handleDel(scope.row)" size="small">删除群组</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination @current-change="pageChange" layout="prev, pager, next" :total="dataCnt">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="创建群组" :visible.sync="visible.handleNew" width="40%">
      <el-form :model="newItem" ref="newForm" v-bind:rules="newFormRules">
        <el-form-item label="群组名" label-width="120px" prop="username">
          <el-input v-model="newItem.groupname"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="confirmNew">确认创建</el-button>
        <el-button @click="visible.handleNew = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除群组" :visible.sync="visible.handleDel" width="40%">
      <div>
        <el-button type="primary" @click="confirmDel">确认删除</el-button>
        <el-button @click="visible.handleDel = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { postGroups, getGroups, deleteGroups } from '../api/api.js';
  export default {
    name: 'groups',
    data() {
      return {
        dataCnt: 0,
        totalGroupsData: [],
        currentGroupsData: [],
        currentPage: 1,
        username: this.$cookies.get('username'),
        newItem: {
          groupname: ""
        },
        delItem: {
          groupid: 0
        },
        visible: {
          handleNew: false,
          handleDel: false
        },
        newFormRules: {
          groupname: [
            { required: true, trigger: "blur", message: "请输入群组名" },
          ]
        }
      }
    },

    methods: {
      errorhandle() {
        alert("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      pageChange(page) {
        this.currentPage = page
        this.showCurrentGroupUser()
      },
      showCurrentPageGroup() {
        this.currentGroupsData = this.totalGroupsData
          .slice((this.currentPage - 1) * 10, this.currentPage * 10)
      },
      new_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.newItem = {
          groupname: ""
        }
        getGroups({}, this.getGroups_callback, this.errorhandle)
      },
      getGroups_callback(response) {
        if (response.data.status == 'success') {
          this.totalGroupsData = response.data.groups
          console.log(this.totalGroupsData)
          this.dataCnt = response.data.groups.length
          this.showCurrentPageGroup()
        } else {
          this.$message.error(response.data.message);
        }
      },
      del_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.delItem = {
          groupid: 0
        }
        getGroups({}, this.getGroups_callback, this.errorhandle)
      },
      confirmNew() {
        this.$refs.newForm.validate(valid => {
          if (!valid) {
            this.$message.error('请输入群组名')
          } else {
            this.visible.handleNew = false
            postGroups(this.newItem, this.new_callback, this.errorhandle)
          }
        })
      },
      handleDel(row) {
        this.visible.handleDel = true
        this.delItem = {
          groupid: row.groupid
        }
      },
      confirmDel() {
        this.visible.handleDel = false
        deleteGroups(this.delItem, this.del_callback, this.errorhandle)
      },
      handleEnter(row){
        this.$router.push('/group/'+row.groupid)
      }
    },
    created() {
      getGroups({}, this.getGroups_callback, this.errorhandle)
    },
    mounted() {
    }
  }
</script>

<style scoped>
  F h2 {
    font-weight: normal;
  }

  .tablecontainer {
    margin: 0 auto;
    width: 75%;
  }
</style>