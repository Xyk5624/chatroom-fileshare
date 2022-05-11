var express = require('express');
var router = express.Router();
var db = require('../util/db');

router.get('/', function (req, res, next) {
  var username = '\'' + req.session.username + '\'';
  var username1 = '\'' + req.session.username + '_\'';
  var username2 = '\'_' + req.session.username + '\'';
  db.sql('select A.groupid as groupid,name,createtime, 1 as type, filename, content,sender from (\
    select A.groupid,max(name) as name,max(createtime) as ct from (\
      select groupname as name,groupid, 1 as type from (\
        select * from friends where userid = (select id from userinfo where username ='+username+')) A\
      inner join groups B on A.groupid = B.id\
    ) A left join group_chat B on A.groupid = B.groupid group by A.groupid ) A\
  left join group_chat B on A.groupid = B.groupid and A.ct = B.createtime;\
    select A.un as name, 0 as type, A.av as avatar, b.content as content, b.filename as filename,\
     a.ct as createtime from (\
      select name,max(username) as un,max(createtime) as ct,max(avatar) as av from(\
          select case \
              when username < '+username+' then username + '+username2+'\
              else '+ username1 +'+username\
              end\
              as name ,username, avatar from \
          (select * from friends where userid = (select id from userinfo where username ='+username+')) A\
          inner join userinfo B on A.friend = B.id ) A left join chat B on A.name = B.chat_id group by name) A\
          left join chat B on A.name = B.chat_id and A.ct = B.createtime;', function (err, result) {
    if (err) {
      console.log("sql错误", err);
      res.send({ "status": "fail", "message": err.message });
      return;
    }
    console.log(result.recordset)
    res.send({ "status": "success", "friends": result.recordsets[0].concat(result.recordsets[1]) });
  });
});

router.post('/', function (req, res, next) {
  var type = req.body.type
  console.log(type)
  var username = '\'' + req.session.username + '\'';
  if (type == "0") {
    console.log("1")
    var target = '\'' + req.body.username + '\'';
    if (target == username) {
      res.send({ "status": "fail", "message": "不能加自己为好友" });
      return
    }
    db.sql('select 1 from userinfo where username =' + target + ';\
    select 1 from friends where userid = \
    (select id from userinfo where username ='+ username + ') and \
    friend = (select id from userinfo where username ='+ target + ');', function (err, result) {
      if (err) {
        console.log("sql错误", err);
        res.send({ "status": "fail", "message": err.message });
        return;
      }
      if (result.recordsets[0].length == 0) {
        res.send({ "status": "fail", "message": "该用户不存在" });
        return
      }
      else {
        if (result.recordsets[1].length != 0) {
          res.send({ "status": "success", "target": req.body.username });
          return
        } else {
          db.sql('insert into friends (userid,friend) values \
          ((select id from userinfo where username = '+ username + '),\
          (select id from userinfo where username = '+ target + '))', function (err, result) {
            if (err) {
              console.log("sql错误", err);
              res.send({ "status": "fail", "message": err.message });
              return;
            }
            res.send({ "status": "success", "target": req.body.username });
          });
        }
      }
    });
  } else {
    var target = '\'' + req.body.groupname + '\'';
    db.sql('select 1 from user_group where groupid = (select id from groups where groupname = ' + target +
      ') and userid = (select id from userinfo where username = ' + username + ')', function (err, result) {
        if (err) {
          console.log("sql错误", err);
          res.send({ "status": "fail", "message": err.message });
          return;
        }
        if (result.recordset.length == 0) {
          res.send({ "status": "fail", "message": "群组不存在或你不是该群组的成员" });
          return
        } else {
          db.sql('insert into friends (userid,groupid) values \
          ((select id from userinfo where username = '+ username + '),\
          (select id from groups where groupname = '+ target + '))', function (err, result) {
            if (err) {
              console.log("sql错误", err);
              res.send({ "status": "fail", "message": err.message });
              return;
            }
            res.send({ "status": "success", "target": req.body.groupname });
          })
        }
      })
  }

});


router.delete('/', function (req, res, next) {
  var type = req.body.type
  var target = '\'' + req.body.username + '\'';
  var username = '\'' + req.session.username + '\'';
  if (type == '0') {
    db.sql('delete from friends where userid = \
    (select id from userinfo where username ='+ username + ') and \
    friend = (select id from userinfo where username ='+ target + ')', function (err, result) {
      if (err) {
        console.log("sql错误", err);
        res.send({ "status": "fail", "message": err.message });
        return;
      } else {
        res.send({ "status": "success", "target": req.body.username });
      }
    });
  } else {
    db.sql('delete from friends where userid = \
    (select id from userinfo where username ='+ username + ') and \
    groupid = (select id from groups where groupname ='+ target + ')', function (err, result) {
      if (err) {
        console.log("sql错误", err);
        res.send({ "status": "fail", "message": err.message });
        return;
      } else {
        res.send({ "status": "success", "target": req.body.username });
      }
    });
  }

});

module.exports = router;
