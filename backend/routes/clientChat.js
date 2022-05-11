var fs = require('fs');
var express = require('express');
var path = require('path');
var router = express.Router({});
var db = require('../util/db');


router.get('/', function (req, res, next) {
  var chat_id = req.query.chat_id
  var offset = req.query.offset
  var type = req.query.type
  if (type == '0') {
    db.sql('select * from chat where chat_id = \'' + chat_id +
      '\' order by createtime desc offset '+offset+' ROWS FETCH NEXT 10 ROWS ONLY;', function (err, result) {
        if (err) {
          console.log("sql错误", err);
          res.send({ "status": "fail", "message": err.message });
          return;
        } else {
          res.send({ "status": "success", "messages": result.recordset, "type": 0 });
        }
      });
  } else {
    db.sql('select * from group_chat where groupid =' + chat_id +
      ' order by createtime desc offset '+offset+' ROWS FETCH NEXT 10 ROWS ONLY;\
      select username,avatar from ((select userid from user_group where groupid =' + chat_id + ') A left join\
      (select id,avatar,username from userinfo) B on A.userid = B.id)', function (err, result) {
      if (err) {
        console.log("sql错误", err);
        res.send({ "status": "fail", "message": err.message });
        return;
      } else {
        res.send({
          "status": "success",
          "messages": result.recordsets[0],
          "userAvatars": result.recordsets[1],
          "type": 1
        });
      }
    });
  }

});

router.post('/', function (req, res, next) {
  var sender = '\'' + req.body.sender + '\''
  var type = req.body.type
  var chat_id = '\'' + req.body.chat_id + '\''
  var content = '\'' + req.body.content + '\''
  if (type == '0') {
    db.sql('insert into chat (chat_id,sender,content,type) values (' +
      chat_id + ',' + sender + ',' + content + ',1);', function (err, result) {
        if (err) {
          console.log("sql错误", err);
          res.send({ "status": "fail", "message": err.message });
          return;
        } else {
          res.send({ "status": "success" });
          return
        }
      });
  } else {
    db.sql('insert into group_chat (groupid,sender,content,type) values ('+
    chat_id + ',' + sender + ',' + content +',1);', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        } else {
          res.send({"status":"success"});
          return
        }
    });
  }

});

module.exports = router;