var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../util/db');

router.get('/', function(req, res, next) {
    console.log(req.params)
    var groupid = req.params.groupid;
    var username = '\''+req.session.username+'\''
    db.sql('select 1 from user_group where groupid = '+groupid +
    ' and userid = (select id from userinfo where username = '+username+')', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        if (result.recordset.length == 0){
          res.status(403);
          res.send();
          return
        }else{
          db.sql('select userid,username from \
          (select userid from user_group where groupid ='+groupid+') A\
          left join userinfo B on A.userid = B.id;\
          select groupname,creator from groups where id ='+groupid+';', function(err, result) {
              if(err) {
                  console.log("sql错误", err);
                  res.send({"status":"fail","message":err.message});
                  return;
              }
              console.log(result.recordset)
              res.send({
                "status":"success",
                "members":result.recordsets[0],
                "groupinfo":result.recordsets[1]
              });
          });
        }
    });
});

router.post('/', function(req, res, next) {
  console.log(req.params)
  var groupid = req.params.groupid;
  var username = '\''+req.session.username+'\''
  var invited_username = '\''+req.body.username+'\''
  db.sql('select 1 from user_group where groupid = '+groupid +
  ' and userid = (select id from userinfo where username = '+username+');\
  select 1 from userinfo where username ='+invited_username+';\
  select 1 from user_group where groupid = '+groupid +
  ' and userid = (select id from userinfo where username = '+invited_username+');', function(err, result) {
      if(err) {
          console.log("sql错误", err);
          res.send({"status":"fail","message":err.message});
          return;
      }
      if (result.recordsets[0].length == 0){
        res.status(403);
        res.send();
        return 
      }
      if (result.recordsets[1].length == 0){
        res.send({"status":"fail","message":"该用户不存在"});
        return 
      } 
      if (result.recordsets[2].length != 0){
        res.send({"status":"fail","message":"该用户已在组内"});
        return 
      } else{
        db.sql('insert into user_group (groupid,userid) values('+groupid+','+
        '(select id from userinfo where username = '+invited_username+'))', function(err, result) {
            if(err) {
                console.log("sql错误", err);
                res.send({"status":"fail","message":err.message});
                return;
            }
            console.log(result.recordset)
            res.send({"status":"success",});
        });
      }
  });
});

router.delete('/', function(req, res, next) {
  var groupid = req.params.groupid;
  var username = '\''+req.session.username+'\'';
  console.log(req.body)
  var userid = req.body.userid
  db.sql('select 1 from groups where id ='+groupid+' and\
  creator = '+username, function(err, result) {
      if(err) {
          console.log("sql错误", err);
          res.send({"status":"fail","message":err.message});
          return;
      }
      if (result.recordset.length == 0){
        res.status(403);
        res.send();
        return
      }else{
        db.sql('delete from user_group where groupid ='+groupid+' and\
        userid = '+userid+';', function(err, result) {
           if(err) {
               console.log("sql错误", err);
               res.send({"status":"fail","message":err.message});
               return;
           }
           res.send({"status":"success"});
       });  
      }
  });     
});

module.exports = router;