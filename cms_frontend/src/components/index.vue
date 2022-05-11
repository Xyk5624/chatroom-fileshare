<template>
  <el-container>
    <el-header>
        <!-- <div v-if="this.$route.name != 'Login'"> -->
        <el-menu mode="horizontal">
            <el-row :gutter="24" style="display:flex;align-items:center;">        
              <el-col :span="2" :offset="22"><el-button @click="onLogout">登出</el-button></el-col>
            </el-row>
        </el-menu>
    </el-header>
    <el-main>
      <h1>用户管理</h1>
      <div class="tablecontainer">
        <el-button type="primary" icon="el-icon-plus" 
        circle style="float: right;" @click="handleNew"></el-button>
        <el-table
          :data="currentUsersData"
          stripe
          style="width: 100%;">
          <el-table-column
            prop="username"
            label="用户名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="180">
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码">
          </el-table-column>
          <el-table-column
            label="操作">
            <div slot-scope="scope">
              <el-button type="primary"  
              @click="handleEdit(scope.row)" 
              size="small">编辑</el-button>
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
      
      <el-dialog title="编辑用户" :visible.sync="visible.handleEdit" width="40%">
        <el-form :model="editItem">
        <el-form-item label="用户名" label-width="120px">
                  <el-input v-model="editItem.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
                  <el-input v-model="editItem.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
                  <el-input v-model="editItem.password"></el-input>
        </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="confirmEdit">确认编辑</el-button>
          <el-button @click="visible.handleEdit = false">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加用户" :visible.sync="visible.handleNew" width="40%">
        <el-form :model="newItem">
        <el-form-item label="用户名" label-width="120px">
                  <el-input v-model="newItem.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
                  <el-input v-model="newItem.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
                  <el-input v-model="newItem.password"></el-input>
        </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="confirmNew">确认添加</el-button>
          <el-button @click="visible.handleNew = false">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="删除用户" :visible.sync="visible.handleDel" width="40%">
        <div>
          <el-button type="primary" @click="confirmDel">确认删除</el-button>
          <el-button @click="visible.handleDel = false">取消</el-button>
        </div>
      </el-dialog>
    </el-main>  
  </el-container>
</template>

<script>
import {getUsers,postUsers,putUsers,deleteUsers,deleteSession} from '../api/api.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      dataCnt: 0,
      totalUsersData: [],
      currentUsersData: [],
      currentPage: 1,
      visible: {
        handleEdit: false,
        handleNew: false,
        handleDel: false
      },
      editItem: {
        id: 0,
        username: "",
        email: "",
        password: ""
      },
      newItem: {
        username: "",
        email: "",
        password: ""
      },
      delItem: {
        id: 0,
      },     
    }
  },
  methods: {
    errorhandle () {
      alert("登陆状态已过期，请重新登录")
      this.$router.push('/login')
    },
    logout_callback(response) {
      console.log(response)
        if (response.data.status == 'success'){                       
          this.$cookies.remove('username');
          this.$router.push('/login')
        }else{
          alert(response.data.message)
        }
    },
    onLogout() {
      deleteSession(this.logout_callback,this.errorhandle)
    },
    getUsers_callback(response){
      console.log(response)
      if (response.data.status == 'success'){
        this.totalUsersData = response.data.users
        this.dataCnt = response.data.users.length
        this.showCurrentPageUser()
      }else{
        this.$message.error(response.data.message);
      }   
    },
    pageChange(page){
      this.currentPage = page
      this.showCurrentPageUser()    
    },
    showCurrentPageUser(){
      this.currentUsersData = this.totalUsersData
      .slice((this.currentPage - 1)*10,this.currentPage*10)
    },
    edit_callback(response){
      if (response.data.status == 'success'){
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      }else{
        this.$message.error(response.data.message);
      }
      getUsers({},this.getUsers_callback,this.errorhandle)     
    },
    new_callback(response){
      if (response.data.status == 'success'){
        this.$message({
          message: '添加成功',
          type: 'success'
        });
      }else{
        this.$message.error(response.data.message);
      }
      this.newItem = {
        username: "",
        email: "",
        password: ""
      }
      getUsers({},this.getUsers_callback)     
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
        id: 0
      }
      getUsers({},this.getUsers_callback,this.errorhandle)
    },
    handleEdit(row){
      this.visible.handleEdit = true
      this.editItem = {
        id: row.id,
        username: row.username,
        email: row.email,
        password: ""
      }
    },
    handleNew(row){
      this.visible.handleNew = true
    },
    handleDel(row){
      this.visible.handleDel = true
      this.delItem = {
        id: row.id
      }
    },
    confirmEdit () {
      console.log(this.editItem)
      if (this.editItem.username == '' || this.editItem.email == '' 
      || this.editItem.password == '' ) {
        alert('参数提交不可以为空！')
        return
      }
      this.visible.handleEdit = false
      putUsers(this.editItem,this.edit_callback,this.errorhandle)
    },
    confirmNew () {
      console.log(this.editItem)
      if (this.newItem.username == '' || this.newItem.email == '' 
      || this.newItem.password == '' ) {
        alert('参数提交不可以为空！')
        return
      }
      this.visible.handleNew = false
      postUsers(this.newItem,this.new_callback,this.errorhandle)
    },
    confirmDel() {
      this.visible.handleDel = false
      deleteUsers(this.delItem,this.del_callback,this.errorhandle)
    }
  },
  created() {
    getUsers({},this.getUsers_callback,this.errorhandle)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
.tablecontainer {
  margin:0 auto;
  width: 75%;
}
</style>
