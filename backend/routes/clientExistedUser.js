var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../util/db');

router.get('/', function(req, res, next) {
  var target = '\''+req.query.username+'\''
  var username = '\''+req.session.username+'\''
  if (target == username) {
    res.send({"status":"fail","message":"不能和自己聊天"});
    return
  }
  db.sql('select 1 from userinfo where username ='+target+';', function(err, result) {
      if(err) {
          console.log("sql错误", err);
          res.send({"status":"fail","message":err.message});
          return;
      }
      if (result.recordsets[0].length == 0){
        res.send({"status":"fail","message":"该用户不存在"});
        return
      } else{
        res.send({"status":"success"});
      }
  });
});

module.exports = router;