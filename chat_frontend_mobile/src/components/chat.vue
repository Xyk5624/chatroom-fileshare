<template>
  <div id="app">
    <div class="chat-container">
      <div class="top-icons">
        <div style="display:inline-block; width: 280px;">
          <van-search v-model="searchContent" placeholder="请输入搜索关键词" @input="handleSearch" />
        </div>
        <van-button round icon="contact" style="position: relative; top: -8px; border: none;" @click="handleUserList" />
        <van-button round icon="friends-o" style="position: relative; top: -8px; border: none;"
          @click="handleGroupList" />
      </div>
      <div class="friends-list">
        <van-cell-group>
          <van-swipe-cell v-for="item in friendList" :key="item">
            <van-cell clickable center size="large" @click="handleClickTable(allFriendList[item])">
              <template #default>
                <van-image v-if="allFriendList[item].type==1" style="top:5px;" round width="50px" height="50px"
                  :src="groupChatImgUrl" />
                <van-image v-if="allFriendList[item].type==0" style="top:5px;" round width="50px" height="50px" :src="allFriendList[item].avatar" />
                <div style="display: inline-block; position: absolute; top:5px; left:58px; right: 0; font-size:18px">
                  <div>{{allFriendList[item].showName}}</div>
                  <div style="font-size:12px; color:gray;">
                    <span v-if="allFriendList[item].type == 1 && allFriendList[item].sender">{{allFriendList[item].sender}}:{{allFriendList[item].content || allFriendList[item].filename}}</span>
                    <span v-if="allFriendList[item].type == 0">{{allFriendList[item].content || allFriendList[item].filename}}</span>
                    <span
                      style="position: absolute; right: 0;font-size:12px; color:gray;">{{showTime(allFriendList[item].createtime)}}</span>
                  </div>
                  <!-- <div style="position: relative; right: 0;font-size:12px; color:gray;">{{showTime(item.createtime)}}</div> -->
                </div>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除聊天" @click="handleDel(item,allFriendList[item].type)"
                style="height: 80px; width:100px" />
            </template>
          </van-swipe-cell>
        </van-cell-group>
      </div>

    </div>
    <van-overlay :lock-scroll="false" :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="fullpage_block">
          <!-- <div style="height:100px; overflow-y: scroll;" ref="messages"> -->
          <div class="fullpage-title-box">

            <van-button icon="arrow-left" round class="backIcon" @click="handleBack"></van-button>
            <span style="font-size: 30px;">{{target}}</span>
          </div>
          <div class="chat">
            <div class="messages" ref="messages">

              <div class="messages-content">
                <div v-for="(item,index) in currrentMessages" :key="index">
                  <div class="timestamp"
                    v-if="index == 0 || timeDiff(currrentMessages[index-1].createtime,item.createtime)">
                    {{showTime(item.createtime)}}
                  </div>
                  <div v-if="item.sender != username && item.type == 1" class="message new">
                    <figure class="avatar">
                      <img :src="userAvatarDict[item.sender] || defaultUserImgUrl" />
                    </figure>
                    <div class="idshow" v-if="chatType==1">{{item.sender}}</div>
                    {{item.content}}

                  </div>
                  <span v-if="item.sender != username && item.type == 2" href=""
                    @click.prevent="download_file(item.filepath,item.filename)" style="color:rgb(19, 62, 255);">
                    <div class="message new">
                      <figure class="avatar">
                        <img :src="userAvatarDict[item.sender] || defaultUserImgUrl" />
                      </figure>
                      <div class="idshow" v-if="chatType==1">{{item.sender}}</div>
                      <van-icon name="description" style="text-decoration:underline;">{{item.filename}}</van-icon>
                    </div>
                  </span>
                  <div v-if="item.sender == username && item.type == 1" class="message message-personal">
                    {{item.content}}
                    <figure class="personal-avatar">
                      <img :src="imageUrl" />
                    </figure>
                  </div>
                  <span v-if="item.sender == username && item.type == 2" href=""
                    @click.prevent="download_file(item.filepath,item.filename)" style="color:rgb(19, 62, 255);">
                    <div class="message message-personal">
                      <van-icon name="description" style="text-decoration:underline;">{{item.filename}}</van-icon>
                      <figure class="personal-avatar">
                        <img :src="imageUrl" />
                      </figure>
                    </div>
                  </span>
                </div>

              </div>
            </div>
            <div class="message-box">
              <!-- <el-upload class="upload-demo" action="" :http-request="uploadFile" :show-file-list="false"
                style="text-align: left;">
                <el-button icon="el-icon-document-add" size="medium"
                  style="background-color: #eee;border: 0px; color: black;"></el-button>
              </el-upload> -->
              <div style="width: 50px;">
                <van-uploader :after-read="afterRead">
                  <van-button icon="add-o" style="background-color: #eee;border: 0px; color: black;"></van-button>
                </van-uploader>
              </div>
              <div>
                <el-input type="textarea" :rows="5" class="message-input" placeholder="Type message..."
                  @keyup.enter.native="submit" v-model="messageContent"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :lock-scroll="false" :show="userListShow" @click="userListShow = false">
      <div class="wrapper" @click.stop>
        <div class="fullpage_block">
          <div class="fullpage-title-box">
            <van-button icon="arrow-left" round class="backIcon" @click="userListShow = false"></van-button>
            <div style="display: inline-block; font-size: 20px; margin-top: 5px;">联系人列表</div>
          </div>
          <van-search v-model="searchUserContent" placeholder="请输入搜索关键词" @input="handleUserSearch" />
          <div class="allusers-list">
            <van-cell-group v-for="item in currUsersList" :key="item.username">
              <van-cell clickable center size="large" @click="addUserFriend(item)">
                <template #default>
                  <van-image style="top:5px;" round width="50px" height="50px" :src="item.avatar" />
                  <span style="position: relative; top: -16px; left:8px; font-size:18px">{{item.username}}</span>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </div>
    </van-overlay>
    <van-overlay :lock-scroll="false" :show="groupListShow" @click="groupListShow = false">
      <div class="wrapper" @click.stop>
        <div class="fullpage_block">
          <div class="fullpage-title-box">
            <van-button icon="arrow-left" round class="backIcon" @click="groupListShow = false"></van-button>
            <div style="display: inline-block; font-size: 20px; margin-top: 5px;">群组列表</div>
          </div>
          <van-search v-model="searchGroupContent" placeholder="请输入搜索关键词" @input="handleGroupSearch" />
          <div class="allusers-list">
            <van-cell-group v-for="item in currGroupsList" :key="item.groupname">
              <van-cell clickable center size="large" @click="addGroupFriend(item)">
                <template #default>
                  <van-image style="top:5px;" round width="50px" height="50px" :src="item.avatar" />
                  <span style="position: relative; top: -16px; left:8px; font-size:18px">{{item.groupname}}</span>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- <van-overlay :show="visible.handleNewGroup" @click="visible.handleNewGroup = false">
      <div class="wrapper" @click.stop>
        <div class="new_user_block">
          <van-button round type="default" icon="cross" class="cross_btn" @click="visible.handleNewGroup = false">
          </van-button>
          <div class="dialog_title">添加群组聊天</div>
          <van-form @submit="confirmNewGroup">
            <van-field v-model="newGroupItem.groupname" name="群组名" label="群组名"
              :rules="[{ required: true, message: '请填写群组名' }]" />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-overlay> -->
    <!-- <el-dialog title="添加聊天" :visible.sync="visible.handleNewUser" width="40%">
      <el-form :model="newUserItem" ref="newUserForm" v-bind:rules="newUserFormRules">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="newUserItem.username"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="confirmNewUser">确认</el-button>
        <el-button @click="visible.handleNewUser = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加群组聊天" :visible.sync="visible.handleNewGroup" width="40%">
      <el-form :model="newGroupItem" ref="newGroupForm" v-bind:rules="newGroupFormRules">
        <el-form-item label="群组名" label-width="120px" prop="groupname">
          <el-input v-model="newGroupItem.groupname"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="confirmNewGroup">确认</el-button>
        <el-button @click="visible.handleNewGroup = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除聊天" :visible.sync="visible.handleDelUser" width="40%">
      <div>
        <el-button type="primary" @click="confirmDelUser">确认</el-button>
        <el-button @click="visible.handleDelUser = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
  import {
    getFriends, postFriends, deleteFriends,
    getGroupUser, postChat, getChat, postChatFiles,
    postGroupChatFiles, downloadFiles, getUsers, getGroups
  } from '../api/api.js';
  import config from '../config/config';
  import sortTime from '../api/util.js';
  var sd = require("silly-datetime");
  export default {
    name: 'index',
    props: ['imageUrl'],
    data() {
      return {
        username: this.$cookies.get('username'),
        idForShow: this.$cookies.get('username').length > 5 ? this.$cookies.get('username').substr(0, 5) + "..."
          : this.$cookies.get('username'),
        show: false,
        userIcon: require("../assets/usericon.png"),
        groupChatImgUrl: require("../assets/group-chat-icon.jpg"),
        defaultUserImgUrl: require("../assets/userImg.png"),
        messageOffset: 0,
        messageContent: "",
        messageList: {},
        userAvatarDict: {},
        groupMembers: [],
        config: config,
        currrentMessages: [],
        allMessages: {},
        allMessagesOffset: {},
        currentPageHeight: 0,
        lastScrollTime: Date.now(),
        chat_id: "",
        chatType: 0,
        visible: {
          handleNewUser: false,
          handleNewGroup: false,
          handleDel: false,
        },
        newUserItem: {
          type: 0,
          username: ""
        },
        delItem: {
          type: 0,
          username: ""
        },
        newGroupItem: {
          type: 1,
          groupname: ""
        },
        target: "",
        targetAvatar: "",
        targetType: 0,
        testarray: [],
        allFriendList: {},
        friendList: [],
        allFriendSortedName: [],
        searchContent: "",
        searchUserContent: "",
        searchGroupContent: "",
        allUsersList: [],
        currUsersList: [],
        allGroupsList: [],
        currGroupsList: [],
        userListShow: false,
        groupListShow: false,
      }
    },
    sockets: {
      // 连接后台socket
      connect() {
        console.log('socket connected');
      },
      // 用户后台调用，添加数据
      sendMessage(data) {
        console.log(data);
      },
      // 用户后台调用，打印数据
      recvMessage(data) {
        console.log('receivemsg');
        console.log(data);
        this.pushMessage(data);
        this.$forceUpdate()
      },
      disconnect() {
        console.log('disconnect：', '已经断开 socket 链接')
      },
    },
    // watch: {
    //   currrentMessages: {
    //     deep: true,
    //     handler: function (val, oldVal) {
    //       // console.log(this.$refs.messages.scrollHeight, this.currentPageHeight)
    //       // if (val[val.length - 1] != oldVal[oldVal.length - 1]) {
    //       //   this.$nextTick(function () {
    //       //     this.scrollToElement()
    //       //   })
    //       // } else {
    //       //   const tmp = this.$refs.messages.scrollHeight - this.currentPageHeight
    //       //   this.currentPageHeight = this.$refs.messages.scrollHeight
    //       //   // this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight - this.currentPageHeight
    //       //   this.$nextTick(function () {
    //       //     this.$refs.messages.scrollTop = tmp
    //       //     this.currentPageHeight = this.$refs.messages.scrollHeight
    //       //   })
    //       // }
    //       //   this.$nextTick(function () {          
    //       //     if (val[val.length - 1] != oldVal[oldVal.length - 1]) {
    //       //       this.scrollToElement()
    //       //       console.log(this.$refs.messages.scrollHeight);
    //       //     }else{
    //       //       console.log(this.$refs.messages.scrollHeight,this.currentPageHeight)
    //       //       this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight - this.currentPageHeight

    //       //     }
    //       //   })
    //       // },
    //     },
    //   },
    // },
    methods: {
      errorhandle() {
        this.$toast.fail("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      handleClickTable(item) {
        this.allMessagesOffset[this.target] = this.messageOffset
        this.target = item.name
        this.targetAvatar = item.avatar
        this.messageOffset = this.allMessagesOffset[this.target] || 0
        console.log(this.messageOffset)
        if (item.type == 0) {
          var id_array = [item.name, this.username].sort()
          this.chat_id = id_array[0] + '_' + id_array[1]
          this.chatType = 0
        } else {
          this.chat_id = item.groupid
          this.chatType = 1
          getGroupUser(this.chat_id, this.getGroupUser_callback, function () { })
        }
        this.userAvatarDict[this.target] = this.targetAvatar
        if (!this.allMessages[this.target]) {
          getChat({
            chat_id: this.chat_id,
            type: item.type,
            offset: this.messageOffset
          }, this.getChat_callback, this.errorhandle)
        } else {
          this.show = true
          this.currrentMessages = this.allMessages[this.target]
          this.$nextTick(function () {
            this.scrollToElement()
            this.currentPageHeight = this.$refs.messages.scrollHeight
          })
        }

      },
      rowStyle({ row, rowIndex }) {
        if (row.name == this.target) {
          console.log(1)
          return "highlighted-row"
        } else {
          return "normal-row"
        }
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (row.name == this.target && columnIndex == 0) {
          return "background-color: #ff4444;"
        } else {
          return ""
        }
      },
      getGroupUser_callback(response) {
        if (response.data.status == 'success') {
          this.groupMembers = []
          for (var i = 0; i < response.data.members.length; i++) {
            this.groupMembers.push(response.data.members[i].username)
          }
        } else {
          this.$message.error(response.data.message);
        }
      },
      getFriends_callback(response) {
        console.log(response.data.friends)
        var url = this.config.url
        var tmpSortArr = []
        if (response.data.status == 'success') {
          // this.allFriendList = response.data.friends
          for (var i = 0; i < response.data.friends.length; i++) {
            let item = response.data.friends[i]
            tmpSortArr.push({name: item.name, createtime: item.createtime})
            this.allFriendList[item.name] = item
            let avatar = item.avatar
            this.allFriendList[item.name].avatar = avatar ? url + avatar : this.defaultUserImgUrl
            let name = item.name
            this.allFriendList[item.name]['showName'] = name.length > 15 ? name.substr(0, 15) + "..." : name
            if (item.filename) {
              let filename = item.filename
              this.allFriendList[item.name].filename = filename.length > 15 ? filename.substr(0, 12) + "..." +
                filename.split(".")[1] : filename
            }
            if (item.content) {
              let content = item.content
              this.allFriendList[item.name].content = content.length > 15 ? content.substr(0, 15) + "..." : content
            }
          }
          this.allFriendSortedName = []
          tmpSortArr.sort(sortTime)
          tmpSortArr.forEach(x => this.allFriendSortedName.push(x.name));
          this.friendList = this.allFriendSortedName
          console.log(this.friendList)
          this.userListShow = false
          this.groupListShow = false
        } else {
          this.$toast.fail(response.data.message);
        }
      },
      newUser_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success('添加成功')
        } else {
          this.$toast.fail(response.data.message);
        }
        this.newUserItem = {
          type: 0,
          username: ""
        }
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      newGroup_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success('添加成功')
        } else {
          this.$toast.fail(response.data.message);
        }
        this.newGroupItem = {
          type: 0,
          groupname: ""
        }
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      confirmNewUser() {
        this.visible.handleNewUser = false
        postFriends(this.newUserItem, this.newUser_callback, this.errorhandle)
      },
      confirmNewGroup() {
        this.visible.handleNewGroup = false
        postFriends(this.newGroupItem, this.newGroup_callback, this.errorhandle)
      },
      addFriend_callback(response) {
        if (response.data.status != 'success') {
          this.$toast.fail(response.data.message);
        }
      },
      addUserFriend(item) {
        postFriends({ type: 0, username: item.username }, this.addFriend_callback, this.errorhandle)
        this.userListShow = false
        item["type"] = 0
        item["name"] = item.username
        this.handleClickTable(item)
      },
      addGroupFriend(item) {
        postFriends({ type: 1, groupname: item.groupname }, this.addFriend_callback, this.errorhandle)
        this.groupListShow = false
        item["type"] = 1
        item["name"] = item.groupname
        this.handleClickTable(item)
      },
      del_callback(response) {
        if (response.data.status == 'success') {
          this.$toast.success("删除成功");
        } else {
          this.$toast.fail(response.data.message);
        }
        this.delItem = {
          username: ""
        }
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      handleDel(username, type) {
        this.delItem = {
          username: username,
          type: type
        }
        deleteFriends(this.delItem, this.del_callback, this.errorhandle)
      },
      // confirmDelUser() {
      //   this.visible.handleDelUser = false
      //   deleteFriends(this.delUserItem, this.delUser_callback, this.errorhandle)
      // },
      download_file(filepath, filename) {
        var requesturl = this.config.url + filepath
        var fileName = filename
        downloadFiles(requesturl, fileName, this.errorhandle)
      },
      upload_callback(response) {
        if (response.data.status == 'success') {
          this.currrentMessages.push({
            sender: this.username,
            type: 2,
            filename: response.data.filename,
            filepath: response.data.filepath,
            createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
          })
          if (this.chatType == 0) {
            this.$socket.emit('sendmsg', {
              chatName: this.username,
              target: this.target,
              sender: this.username,
              type: 2,
              filename: response.data.filename,
            })
          } else {
            this.$socket.emit('sendgroupmsg', {
              chatName: this.target,
              target: this.groupMembers,
              sender: this.username,
              type: 2,
              filename: response.data.filename,
            })
          }
          this.$forceUpdate()
          this.$nextTick(function () {
            this.scrollToElement()
          })
        } else {
          alert(response.data.message)
        }
      },
      uploadFile(param) {
        const formData = new FormData();
        formData.append("file", param.file);
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (this.chatType == 0) {
          postChatFiles(this.chat_id, formData, configs, this.upload_callback, this.errorhandle)
        } else {
          postGroupChatFiles(this.chat_id, formData, configs, this.upload_callback, this.errorhandle)
        }
      },
      afterRead(file) {
        const formData = new FormData();
        formData.append("file", file.file);
        var configs = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (this.chatType == 0) {
          postChatFiles(this.chat_id, formData, configs, this.upload_callback, this.errorhandle)
        } else {
          postGroupChatFiles(this.chat_id, formData, configs, this.upload_callback, this.errorhandle)
        }
      },
      pushMessage(data) {
        if (data.type == 1) {
          console.log(this.allMessages)
          console.log(data.chatName)
          if (data.chatName == this.target) {
            this.currrentMessages.push({
              sender: data.sender,
              type: 1,
              content: data.content,
              createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
            })
          } else if (this.allMessages[data.chatName]) {
            this.allMessages[data.chatName].push({
              sender: data.sender,
              type: 1,
              content: data.content,
              createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
            })
          }
          this.allFriendList[data.chatName].filename = null
          this.allFriendList[data.chatName].content = data.content.length > 10 ?
            data.content.substr(0, 10) + "..." : data.content
        } else {
          if (data.chatName == this.target) {
            this.currrentMessages.push({
              sender: data.sender,
              type: 2,
              filename: data.filename,
              filepath: data.filepath,
              createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
            })
          } else if (this.allMessages[data.chatName]) {
            !this.allMessages[data.chatName].push({
              sender: data.sender,
              type: 2,
              filename: data.filename,
              filepath: data.filepath,
              createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
            })
          }
          this.allFriendList[data.chatName].content = null
          this.allFriendList[data.chatName].sender = data.sender
          this.allFriendList[data.chatName].filename = data.filename.length > 10 ?
            data.filename.substr(0, 10) + "..." + data.filename.split(".")[1] : data.filename
        }
        this.allFriendList[data.chatName].createtime = sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
        let tmpIndex = this.allFriendSortedName.indexOf(data.chatName)
        this.allFriendSortedName.splice(tmpIndex,1)
        this.allFriendSortedName.unshift(data.chatName)
        this.$nextTick(function () {
          this.scrollToElement()
        })
      },
      join() {
        this.$socket.emit("join", {
          username: this.username
        });
      },
      getChat_callback(response) {
        var url = this.config.url
        if (response.data.status == 'success') {
          if (response.data.type == 1) {
            for (var i = 0; i < response.data.userAvatars.length; i++) {
              var item = response.data.userAvatars[i]
              this.userAvatarDict[item.username] = item.avatar ? url + item.avatar : this.defaultUserImgUrl
            }
          }
          if (this.messageOffset == 0) {
            this.currrentMessages = []
          }
          for (var i = 0; i < response.data.messages.length; i++) {
            this.currrentMessages.unshift(response.data.messages[i])
          }
          this.allMessages[this.target] = this.currrentMessages
          this.show = true
          if (this.messageOffset == 0) {
            this.$nextTick(function () {
              this.scrollToElement()
              this.currentPageHeight = this.$refs.messages.scrollHeight
            })
          } else {
            this.$nextTick(function () {
              this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight - this.currentPageHeight
              this.currentPageHeight = this.$refs.messages.scrollHeight
              console.log(this.$refs.messages.scrollTop)
            })
          }
        } else {
          alert(response.data.message)
          this.show = false
        }
      },
      postChat_callback(response) {
        console.log(response)
        if (response.data.status != 'success') {
          alert(response.data.message)
          this.show = false
        }
      },
      handleUserList() {
        if (this.allUsersList.length == 0) {
          getUsers({}).then(response => {
            this.allUsersList = response.data.users
            for (var i = 0; i < this.allUsersList.length; i++) {
              this.allUsersList[i].avatar = this.allUsersList[i].avatar ? this.config.url + this.allUsersList[i].avatar
                : this.defaultUserImgUrl
            }
            this.currUsersList = this.allUsersList
            this.userListShow = true
          }).catch(error => {
            this.errorhandle()
          })
        } else {
          this.userListShow = true
        }
      },
      getGroups_callback(response) {
        if (response.data.status == 'success') {
          this.allGroupsList = response.data.groups
          for (var i = 0; i < this.allGroupsList.length; i++) {
            this.allGroupsList[i].avatar = this.allGroupsList[i].avatar ? this.config.url + this.allGroupsList[i].avatar
              : this.defaultUserImgUrl
          }
          this.currGroupsList = this.allGroupsList
          this.groupListShow = true
        } else {
          this.$toast.fail(response.data.message);
        }
      },
      handleGroupList() {
        if (this.allGroupsList.length == 0) {
          getGroups({}, this.getGroups_callback, this.errorhandle)
        } else {
          this.groupListShow = true
        }
      },
      handleBack() {
        this.show = false
        this.target = ''
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      submit() {
        if (this.messageContent != "" && this.messageContent != "\n") {
          this.currrentMessages.push({
            type: 1,
            sender: this.username,
            content: this.messageContent,
            createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
          })
          this.$forceUpdate()
          this.$nextTick(function () {
            this.scrollToElement()
          })
          if (this.chatType == 0) {
            this.$socket.emit('sendmsg', {
              chatName: this.username,
              target: this.target,
              sender: this.username,
              type: 1,
              content: this.messageContent,
              createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
            })
          } else {
            this.$socket.emit('sendgroupmsg', {
              chatName: this.target,
              target: this.groupMembers,
              sender: this.username,
              type: 1,
              content: this.messageContent,
              createtime: sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
            })
          }
          postChat({
            chat_id: this.chat_id,
            type: this.chatType,
            content: this.messageContent,
            sender: this.username
          }, this.postChat_callback, this.errorhandle)
        }
        this.messageContent = ""
      },
      scrollToElement() {
        const el = this.$refs.messages;
        el.scrollTop = el.scrollHeight;
      },
      showTime(time) {
        if (time === null) {
          return null
        }
        time = (time.split(":")[0] + ":" + time.split(":")[1]).replace("T", " ")
        var currentDate = sd.format(Date.now(), 'YYYY-MM-DD')
        if (time.split(" ")[0] == currentDate) {
          //发送日期在今天，显示时分
          return time.split(" ")[1]
        } else if (time.split("-")[0] == currentDate.split("-")[0]) {
          //发送日期在今年，显示日月时分
          return time.split("-")[1] + "-" + time.split("-")[2]
        } else {
          //发送日期不在今年，显示年月日
          return time.split(" ")[0];
        }
      },
      timeDiff(time1, time2) {
        time1 = (time1.split(":")[0] + ":" + time1.split(":")[1]).replace("T", " ")
        time2 = (time2.split(":")[0] + ":" + time2.split(":")[1]).replace("T", " ")
        var timestamp1 = (new Date(Date.parse(time1.replace(/-/g, "/")))).getTime() / 1000;
        var timestamp2 = (new Date(Date.parse(time2.replace(/-/g, "/")))).getTime() / 1000;
        if (timestamp2 - timestamp1 > 1200) {
          return true
        } else {
          return false
        }
      },
      handleSearch(query) {
        if (query !== "") {
          setTimeout(() => {
            this.friendList = this.allFriendSortedName.filter((item) => {
              return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.friendList = this.allFriendSortedName
        }
      },
      handleUserSearch(query) {
        if (query !== "") {
          setTimeout(() => {
            this.currUsersList = this.allUsersList.filter((item) => {
              return item.username.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.currUsersList = this.allUsersList;
        }
      },
      handleGroupSearch(query) {
        if (query !== "") {
          setTimeout(() => {
            this.currGroupsList = this.allGroupsList.filter((item) => {
              return item.groupname.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.currGroupsList = this.allGroupsList
        }
      },
      handleScroll() {
        if (this.$refs.messages.scrollTop == 0 && Date.now() - this.lastScrollTime > 1000 && this.show) {
          this.messageOffset += 10
          this.lastScrollTime = Date.now()
          var _self = this
          setTimeout(function () {
            getChat({
              chat_id: _self.chat_id,
              type: _self.chatType,
              offset: _self.messageOffset
            }, _self.getChat_callback, _self.errorhandle)
          }, 500);
        }
      }
    },

    created() {
      this.join()
      getFriends(this.getFriends_callback, this.errorhandle)
    },
    updated() {

    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll, true)
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.handleScroll, true);
    }
  }
</script>

<style>
  .userContainer {
    width: 50%;
    margin: 0 auto;
  }

  .el-table {
    overflow: hidden;
  }



  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /*--------------------
Chat
--------------------*/
  .box {
    overflow: auto;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .chat-container {
    /* position: absolute;
    top: 80px; */
    /* width: 100%; */
    /* width: 1150px;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 5px;
    background-color: #6e6e6e; */
  }

  .chat-container .friends-list .van-cell {
    height: 80px;
  }

  .new_user_block {
    width: 500px;
    height: 350px;
    background-color: #fff;
  }

  .fullpage_block {
    position: absolute;
    top: 0;
    width: 100%;
    height: calc(100% - 70px);
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

  .backIcon {
    position: absolute;
    left: 0;
    border: none;
    float: left;
    background-color: transparent;
  }

  .allusers-list {
    clear: both;
    height: 85%;
    overflow-y: scroll;
  }

  .chat-leftcontainer {
    position: relative;
    top: 0;
    right: 0;
    border-right: 1px solid #000;
    width: 320px;
    height: 100%;
    border-radius: 5px 0 0 5px;
    background: #33353a;
  }

  .chat-rightcontainer {
    position: absolute;
    left: 320px;
    top: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0 5px 5px 0;
    width: 830px;
    background: #eee;
  }

  .avatar-box {
    position: absolute;
    left: 15px;
    top: 15px;
    height: 50px;
    width: 50px;
    display: inline-flex;
  }

  .username-box {
    position: absolute;
    top: 15px;
    left: 80px;
    height: 50px;
    width: 150px;
    display: inline-flex;
    word-break: break-all;
  }

  .left-button-box {
    position: absolute;
    top: 15px;
    left: 220px;
    display: inline-flex;
  }

  .search-box {
    position: absolute;
    top: 80px;
    left: 15px;
    width: 290px;
  }

  .search-box .el-input input {
    background-color: #696c74;
    color: white;
    border: 0px;
  }

  .search-box .el-input .el-button--primary {
    margin: 0 auto !important;
  }

  .friend-list-table {
    position: absolute;
    top: 130px;
    left: 0px;
    background: #33353a;
  }

  .friend-list-table .el-table {
    background-color: #33353a;
  }

  .friend-list-table .el-table__body tr:hover>td {
    background-color: #909090 !important;
  }

  .friend-list-table .el-table__row>td {
    border: none;
  }

  .friend-list-table .el-table::before {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
  }


  .el-table .highlighted-row {
    background-color: #636363;
  }

  .el-table tr {
    border-left: 20px solid #8f0505;
    border-bottom: none;
    border-collapse: collapse;
  }

  .el-table .normal-row {
    background-color: #33353a;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    /*width: 0;宽度为0隐藏*/
    width: 0;
  }

  .fullpage-title-box {
    position: relative;
    top: 0;
    width: 100%;
    height: 60px;
    text-align: center;
    border-bottom: 1px solid rgb(216, 216, 216);
  }

  .chat {
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 0;
    z-index: 2;
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  /*--------------------
Chat Title
--------------------*/
  .chat-title {
    -webkit-box-flex: 0;
    -ms-flex: 0 1 45px;
    flex: 0 1 45px;
    position: relative;
    z-index: 2;
    background: #000;
    color: #fff;
    text-transform: uppercase;
    text-align: left;
    padding: 10px 10px 10px 50px;
  }

  .chat-title h1,
  .chat-title h2 {
    font-weight: normal;
    font-size: 10px;
    margin: 0;
    padding: 0;
  }

  .chat-title h2 {
    color: rgba(255, 255, 255, 0.5);
    font-size: 8px;
    letter-spacing: 1px;
  }

  .chat-title .avatar {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 9px;
    border-radius: 30px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(255, 255, 255, 0.24);
  }


  /*--------------------
Messages
--------------------*/
  .chat .messages {
    /* -webkit-box-flex: 1; */
    /* -ms-flex: 1 1 auto; */
    /* flex: 1 1 auto; */
    /* color: #000; */
    overflow: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .chat .messages .messages-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .chat .messages .message {
    clear: both;
    float: left;
    padding: 12px 15px 10px;
    border-radius: 0 10px 10px 10px;
    background: rgba(0, 0, 0, 0.1);
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.4;
    margin-left: 50px;
    position: relative;
    word-break: break-all;
    max-width: 400px;
    text-align: left;
  }

  .messages .timestamp {
    clear: both;
    padding: 4px 0;
    margin: 0 auto;
    position: relative;
    font-size: 15px;
    text-align: center;
    color: rgb(168, 168, 168);
  }

  .messages .message::before {
    content: '';
    position: absolute;
    top: 0px;
    left: -7px;
    border-top: 6px solid rgba(0, 0, 0, 0.1);
    border-left: 7px solid transparent;
  }

  .messages .message .avatar {
    position: absolute;
    z-index: 1;
    top: 0;
    left: -45px;
    border-radius: 30px;
    width: 40px;
    height: 40px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    /* border: 2px solid rgba(255, 255, 255, 0.24); */
  }

  .messages .message .avatar img {
    width: 100%;
    height: auto;
  }

  .messages .message .idshow {
    position: absolute;
    top: -25px;
    left: 0px;
    font-size: 14px;
    color: #000;
    width: 300px;
  }


  .messages .message.message-personal {
    float: right;
    /* color: #000; */
    background: rgb(229, 243, 253);
    margin-right: 50px;
    margin-top: 0px;
    margin-bottom: 0px;
    border-radius: 10px 0 10px 10px;
  }

  .messages .message.message-personal::before {
    left: auto;
    right: -5px;
    z-index: 0;
    border-left: none;
    border-right: 5px solid transparent;
    border-top: 4px solid rgb(229, 243, 253) !important;
    bottom: -4px;
  }

  .messages .message-personal .personal-avatar {
    position: absolute;
    z-index: 1;
    top: 0;
    right: -45px;
    border-radius: 30px;
    width: 40px;
    height: 40px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    /* border: 2px solid rgba(255, 255, 255, 0.24); */
  }

  .messages .message-personal .personal-avatar img {
    width: 100%;
    height: auto;
  }


  .messages .message:last-child {
    margin-bottom: 30px;
  }

  .messages .message.new {
    margin-left: 50px;
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .message-box {
    -webkit-box-flex: 0;
    -ms-flex: 0 1 40px;
    flex: 0 1 40px;
    width: 100%;
    height: 150px;
    background-color: #eee;
    border-top: 1px solid rgb(216, 216, 216);
  }

  .message-box .el-textarea__inner,
  .el-textarea {
    height: 100% !important;
    width: 102% !important;
    border: 0;
    resize: none;
    background-color: #eee;
  }

  .message-box .message-input {
    background: none;
    border: none;
    outline: none !important;
    resize: none;
    color: #fff;
    font-size: 16px;
    height: 40px;
    margin: 0;
    padding-right: 20px;
    width: 100%;
  }

  .message-box textarea:focus:-webkit-placeholder {
    color: transparent;
  }

  .message-box .message-submit {
    position: absolute;
    z-index: 1;
    top: 9px;
    right: 10px;
    color: #000;
    border: none;
    background: #fff;
    font-size: 10px;
    text-transform: uppercase;
    line-height: 1;
    padding: 6px 10px;
    outline: none !important;
    -webkit-transition: background .2s ease;
    transition: background .2s ease;
  }

  .message-box .message-submit:hover {
    background: #999;
  }
</style>