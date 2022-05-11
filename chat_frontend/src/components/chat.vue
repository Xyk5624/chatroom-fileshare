<template>
  <div id="app">
    <div class="box">
      <div class="chat-container">
        <div class="chat-leftcontainer">
          <div class="avatar-box">
            <img :src="imageUrl" style="height: 50px; width: 50px; border-radius: 50%" />
          </div>
          <div class="username-box"><span style="color:white;font-size: 30px; margin:auto 0;">{{idForShow}}</span></div>
          <div class="left-button-box">
            <el-button type="primary" icon="el-icon-user" circle @click="visible.handleNewUser = true"
              style="background-color: #33353a;border: 0px;">
            </el-button>
            <el-button type="primary" icon="el-icon-chat-dot-round" circle @click="visible.handleNewGroup = true"
              style="background-color: #33353a;border: 0px;">
            </el-button>
          </div>
          <div class="search-box">
            <el-input prefix-icon="el-icon-search" placeholder="查找联系人" v-model="searchContent" @input="handleSearch">
              <el-button v-if="searchContent!=''" size="mini" circle slot="suffix" class="el-icon-close" style="margin-top:7px !important;background-color: rgb(196, 196, 196); border: 0;
              color:black;" @click="clearInput"></el-button>
              <!-- <el-button size="mini" circle slot="suffix" style="margin: 0 auto !important;">%</el-button> -->
            </el-input>
          </div>
          <div class="friend-list-table">
            <el-table :data="friendList" height="75vh" :row-class-name="rowStyle" :cell-style="cellStyle"
              :show-header="false" style="width: 320px;" @row-click="handleClickTable" @row-contextmenu="handleDel">
              <el-table-column width="3">
              </el-table-column>
              <el-table-column width="57">
                <div slot-scope="scope">
                  <img v-if="allFriendList[scope.row].type==0" :src="allFriendList[scope.row].avatar"
                    style="height: 45px; width: 45px; border-radius: 50%" />
                  <img v-if="allFriendList[scope.row].type==1" :src="groupChatImgUrl"
                    style="height: 45px; width: 45px; border-radius: 50%" />
                </div>
              </el-table-column>
              <el-table-column width="260" className="nameColumn">
                <div slot-scope="scope">
                  <div style="color:white;font-size: 16px; margin-top: 0;">{{scope.row}}</div>
                  <div style="color:grey;font-size: 12px;">
                    <span>{{allFriendList[scope.row].content || allFriendList[scope.row].filename}}</span>
                    <span
                      style="position: absolute; right: 20px;">{{showTime(allFriendList[scope.row].createtime)}}</span>
                  </div>
                </div>
              </el-table-column>
            </el-table>
          </div>

        </div>
        <div class="chat-rightcontainer">
          <div style=" overflow: hidden;" v-if="show">
            <div class="target-title-box">
              <div style="position:relative; top: 10px; font-size: 30px;">{{target}}</div>
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
                    <!-- <div v-if="item.sender != username && item.type == 1" class="message new"></div> -->
                    <a v-if="item.sender != username && item.type == 2" href=""
                      @click.prevent="download_file(item.filepath,item.filename)">
                      <div class="message new">
                        <figure class="avatar">
                          <img :src="userAvatarDict[item.sender] || defaultUserImgUrl" />
                        </figure>
                        <div class="idshow" v-if="chatType==1">{{item.sender}}</div>
                        <span class="el-icon-folder"></span>{{item.filename}}
                      </div>
                    </a>
                    <div v-if="item.sender == username && item.type == 1" class="message message-personal">
                      {{item.content}}
                      <figure class="personal-avatar">
                        <img :src="imageUrl" />
                      </figure>
                      <!-- <div class="personal-timestamp">{{showTime(item.createtime)}}</div> -->
                    </div>
                    <a v-if="item.sender == username && item.type == 2" href=""
                      @click.prevent="download_file(item.filepath,item.filename)">
                      <div class="message message-personal"><span class="el-icon-folder"></span>{{item.filename}}
                        <figure class="personal-avatar">
                          <img :src="imageUrl" />
                        </figure>
                        <!-- <div class="personal-timestamp">{{showTime(item.createtime)}}</div> -->
                      </div>
                    </a>
                  </div>

                </div>
              </div>
              <!-- <div class="button-box">
                  <el-upload class="upload-demo" action="" :http-request="uploadFile" :show-file-list="false"
                    style="float: left;">
                    <el-button type="primary" icon="el-icon-document-add" size="mini" circle></el-button>
                  </el-upload>
                </div> -->
              <div class="message-box">
                <!-- <div class="message-button-box"> -->
                <el-upload class="upload-demo" action="" :http-request="uploadFile" :show-file-list="false"
                  style="text-align: left;">
                  <el-button icon="el-icon-document-add" size="medium"
                    style="background-color: #eee;border: 0px; color: black;"></el-button>
                </el-upload>
                <div>
                  <el-input type="textarea" :rows="5" class="message-input" placeholder="Type message..."
                    @keyup.enter.native="submit" v-model="messageContent"></el-input>
                </div>

                <!-- </div> -->
                <!-- <el-row>
                    <el-col :span="1">
                      <el-upload class="upload-demo" action="" :http-request="uploadFile" :show-file-list="false">
                        <el-button type="primary" icon="el-icon-document-add" circle></el-button>
                      </el-upload>
                    </el-col>
                    <el-col :span="20" :offset="1">
                      <el-input type="textarea" :rows="1" class="message-input" placeholder="Type message..."
                        @keyup.enter.native="submit" v-model="messageContent"></el-input>
                    </el-col>
                    <el-col :span="1">
                      <el-button type="primary" icon="el-icon-s-promotion" circle @click="submit"></el-button>
                    </el-col>
                  </el-row> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="添加聊天" :visible.sync="visible.handleNewUser" width="40%">
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
    <el-dialog title="删除聊天" :visible.sync="visible.handleDel" width="40%">
      <div>
        <el-button type="primary" @click="confirmDel">确认</el-button>
        <el-button @click="visible.handleDel = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getFriends, postFriends, deleteFriends,
    getGroupUser, postChat, getChat, postChatFiles, postGroupChatFiles, downloadFiles
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
        newUserFormRules: {
          username: [
            { required: true, trigger: "blur", message: "请输入用户名" },
          ]
        },
        newGroupFormRules: {
          groupname: [
            { required: true, trigger: "blur", message: "请输入群组名" },
          ]
        },
        visible: {
          handleNewUser: false,
          handleNewGroup: false,
          handleDel: false,
          handleDelGroup: false,
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
        searchContent: ""
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
        alert("登陆状态已过期，请重新登录")
        this.$router.push('/login')
      },
      handleClickTable(row, column, event) {
        this.allMessagesOffset[this.target] = this.messageOffset
        this.target = row
        this.targetAvatar = this.allFriendList[row].avatar
        this.messageOffset = this.allMessagesOffset[this.target] || 0
        console.log(this.messageOffset)
        if (this.allFriendList[row].type == 0) {
          var id_array = [row, this.username].sort()
          this.chat_id = id_array[0] + '_' + id_array[1]
          this.chatType = 0
        } else {
          this.chat_id = this.allFriendList[row].groupid
          this.chatType = 1
          getGroupUser(this.chat_id, this.getGroupUser_callback, function () { })
        }
        this.userAvatarDict[this.target] = this.targetAvatar
        if (!this.allMessages[this.target]) {
          getChat({
            chat_id: this.chat_id,
            type: this.allFriendList[row].type,
            offset: this.messageOffset
          }, this.getChat_callback, this.errorhandle)
        } else {
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
            tmpSortArr.push({ name: item.name, createtime: item.createtime })
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
          this.$message.error(response.data.message);
        }
      },
      newUser_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.newUserItem = {
          type: 0,
          username: ""
        }
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      newGroup_callback(response) {
        if (response.data.status == 'success') {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        } else {
          this.$message.error(response.data.message);
        }
        this.newGroupItem = {
          type: 1,
          groupname: ""
        }
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      confirmNewUser() {
        this.$refs.newUserForm.validate(valid => {
          if (!valid) {
            this.$message.error('请输入用户名')
          } else {
            this.visible.handleNewUser = false
            postFriends(this.newUserItem, this.newUser_callback, this.errorhandle)
          }
        })
      },
      confirmNewGroup() {
        this.$refs.newGroupForm.validate(valid => {
          if (!valid) {
            this.$message.error('请输入群组名')
          } else {
            this.visible.handleNewGroup = false
            postFriends(this.newGroupItem, this.newGroup_callback, this.errorhandle)
          }
        })
      },
      del_callback(response) {
        console.log(response)
        console.log(this.target)
        if (response.data.status == 'success') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          if (this.target == response.data.target) {
            this.show = false
          }
        } else {
          this.$message.error(response.data.message);
        }
        this.delItem = {
          username: ""
        }
        getFriends(this.getFriends_callback, this.errorhandle)
      },
      handleDel(row, column, event) {
        event.preventDefault();
        this.visible.handleDel = true
        this.delItem = {
          username: row,
          type: this.allFriendList[row].type
        }
      },
      confirmDel() {
        this.visible.handleDel = false
        deleteFriends(this.delItem, this.del_callback, this.errorhandle)
      },
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
          this.allFriendList[this.target].content = null
          this.allFriendList[this.target].filename = response.data.filename.length > 10 ?
            response.data.filename.substr(0, 10) + "..." + response.data.filename.split(".")[1] : response.data.filename
          this.allFriendList[this.target].createtime = sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
          let tmpIndex = this.allFriendSortedName.indexOf(this.target)
          this.allFriendSortedName.splice(tmpIndex, 1)
          this.allFriendSortedName.unshift(this.target)
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
            !this.allMessages[data.chastName].push({
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
        this.allFriendSortedName.splice(tmpIndex, 1)
        this.allFriendSortedName.unshift(data.chatName)
        if (this.show) {
          this.$nextTick(function () {
            this.scrollToElement()
          })
        }
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
          this.allFriendList[this.target].content = this.messageContent.length > 10 ?
            this.messageContent.substr(0, 10) + "..." : this.messageContent
          this.allFriendList[this.target].createtime = sd.format(Date.now(), 'YYYY-MM-DD HH:mm')
          let tmpIndex = this.allFriendSortedName.indexOf(this.target)
          this.allFriendSortedName.splice(tmpIndex, 1)
          this.allFriendSortedName.unshift(this.target)
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
            this.friendList = this.allFriendList.filter((item) => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.friendList = this.allFriendList;
        }
      },
      clearInput() {
        this.searchContent = ""
        this.handleSearch("")
      },
      handleScroll() {
        if (this.$refs.messages.scrollTop == 0 && Date.now() - this.lastScrollTime > 1000) {
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
    position: absolute;
    width: 1150px;
    top: 60px;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 5px;
    background-color: #6e6e6e;
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

  .nameColumn {
    vertical-align: top !important;
    ;
  }

  .target-title-box {
    position: relative;
    top: 0;
    left: 20px;
    width: 790px;
    height: 60px;
    text-align: left;
    border-bottom: 1px solid rgb(216, 216, 216);
  }

  .chat {
    position: absolute;
    width: 100%;
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
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    color: #000;
    overflow: hidden;
    overflow-y: scroll;
    position: relative;
    width: 100%;
    height: calc(200vh - 20px);
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
    border: 2px solid rgba(255, 255, 255, 0.24);
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
    color: #000;
    background: rgb(229, 243, 253);
    margin-right: 40px;
    margin-top: 0px;
    margin-bottom: 0px;
    border-radius: 10px 0 10px 10px;
  }

  .messages .message.message-personal::before {
    left: auto;
    right: -5px;
    border-left: none;
    border-right: 5px solid transparent;
    border-top: 4px solid rgb(220, 255, 253);
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
    border: 2px solid rgba(255, 255, 255, 0.24);
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
    height: 400px;
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