<template>
  <div id="app">
    <h1>群组</h1>
    <div>
      <van-button type="info" @click="visible.handleNew = true" style="float: right;">新建群组</van-button>
    </div>

    <div class="tablecontainer">
      <!-- <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="visible.handleNew = true">新建群组
      </el-button> -->

      <van-cell-group>
        <van-swipe-cell v-for="item in currentGroupsData" :key="item.groupname">
          <a @click="handleEnter(item.groupid)" target="_blank" class="link">
            <van-cell value-class="file-link" :border="false" :value="item.groupname" />
          </a>
          <template #right>
            <van-button square type="info" text="详细信息" @click="showDetail(item.creator,item.createtime)" />
            <van-button square type="primary" text="进入" @click="handleEnter(item.groupid)" />
            <van-button square type="danger" text="删除" @click="handleDel(item.groupid)" />
          </template>
        </van-swipe-cell>
      </van-cell-group>
      <van-pagination v-model="currentPage" :total-items="dataCnt" :items-per-page="10" @change="pageChange" />
      <!-- <el-table :data="currentGroupsData" stripe style="width: 100%;">
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
      </div> -->
    </div>
    <van-overlay :show="visible.handleNew" @click="visible.handleNew = false">
      <div class="wrapper" @click.stop>
        <div class="new_dialog_block">
          <van-button round type="default" icon="cross" class="cross_btn" @click="visible.handleNew = false">
          </van-button>
          <div class="dialog_title">创建群组</div>
          <van-form @submit="confirmNew">
            <van-field v-model="newItem.groupname" name="群组名" label="群组名"
              :rules="[{ required: true, message: '请填写群组名' }]" />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-overlay>
    <!-- <el-dialog title="创建群组" :visible.sync="visible.handleNew" width="40%">
      <el-form :model="newItem" ref="newForm" v-bind:rules="newFormRules">
        <el-form-item label="群组名" label-width="120px" prop="username">
          <el-input v-model="newItem.groupname"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="confirmNew">确认创建</el-button>
        <el-button @click="visible.handleNew = false">取消</el-button>
      </div>
    </el-dialog> -->
    <!-- <el-dialog title="删除群组" :visible.sync="visible.handleDel" width="40%">
      <div>
        <el-button type="primary" @click="confirmDel">确认删除</el-button>
        <el-button @click="visible.handleDel = false">取消</el-button>
      </div>
    </el-dialog> -->
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
      }
    },

    methods: {
      errorhandle() {
        this.$toast.fail("登陆状态已过期，请重新登录")
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
          this.$toast.success("添加成功")
        } else {
          this.$toast.fail(response.data.message);
        }
        this.newItem = {
          groupname: ""
        }
        getGroups({}, this.getGroups_callback, this.errorhandle)
      },
      getGroups_callback(response) {
        if (response.data.status == 'success') {
          this.totalGroupsData = response.data.groups
          this.dataCnt = response.data.groups.length
          this.showCurrentPageGroup()
        } else {
          this.$toast.fail(response.data.message);
        }
      },
      del_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success("删除成功")
        } else {
          this.$toast.fail(response.data.message);
        }
        this.delItem = {
          groupid: 0
        }
        getGroups({}, this.getGroups_callback, this.errorhandle)
      },
      confirmNew() {
        this.visible.handleNew = false
        postGroups(this.newItem, this.new_callback, this.errorhandle)
      },
      handleDel(groupid) {
        this.$dialog.confirm({
          title: '删除群组',
          message: '确认删除该群组吗',
        })
          .then(() => {
            this.delItem = {
              groupid: groupid
            }
            deleteGroups(this.delItem, this.del_callback, this.errorhandle)
          })
          .catch(() => {
            // on cancel
          });
      },
      confirmDel() {
        this.visible.handleDel = false
        deleteGroups(this.delItem, this.del_callback, this.errorhandle)
      },
      handleEnter(groupid) {
        this.$router.push('/group/' + groupid)
      },
      showDetail(creator, createtime) {
        var detailText = `创建者: ${creator}
        创建时间: ${createtime}`
        this.$dialog.alert({
          message: detailText,
        }).then(() => {
          // on close
        });
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
    clear: both;
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