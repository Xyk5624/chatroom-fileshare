var express = require('express');
var router = express.Router();
var db = require('../util/db');

router.get('/', function(req, res, next) {
  var username = '\'' + req.session.username + '\''
  db.sql('select * from userinfo where username != '+username+'order by username;', function(err, result) {
      if(err) {
          console.log("sql错误", err);
          res.send({"status":"fail","message":err.message});
          return;
      }
      res.send({"status":"success","users":result.recordset});
  });
});

module.exports = router;