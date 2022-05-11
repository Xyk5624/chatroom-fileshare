var fs = require('fs');
var express = require('express');
var path = require('path');
var router = express.Router({ mergeParams: true });
var db = require('../util/db');


router.get('/', function(req, res, next) {
  var groupid = '\''+req.params.groupid+'\''
  db.sql('select * from group_chat where groupid ='+groupid+
  ' order by createtime;', function(err, result) {
      if(err) {
          console.log("sql错误", err);
          res.send({"status":"fail","message":err.message});
          return;
      }else{
        res.send({"status":"success","messages": result.recordset});
      }
  });
});

router.post('/', function(req, res, next) {
    var sender = '\''+req.body.sender+'\''
    var groupid = '\''+req.params.groupid+'\''
    var content = '\''+req.body.content+'\''
    db.sql('insert into group_chat (groupid,sender,content,type) values ('+
    groupid + ',' + sender + ',' + content +',1);', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        } else {
          res.send({"status":"success"});
          return
        }
    });
});

module.exports = router;