var express = require('express');
var router = express.Router();
var db = require('../util/db');

router.get('/', function(req, res, next) {
    var username = '\''+req.session.username+'\'';
    db.sql('select groupid,groupname,creator,createtime from \
    (select * from user_group where userid = (select id from userinfo where username ='+username+')) A\
    left join groups B on A.groupid = B.id', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        console.log(result.recordset)
        res.send({"status":"success","groups":result.recordset});
    });
});

router.post('/', function(req, res, next) {
    var groupname = '\''+req.body.groupname+'\'';
    var creator = '\''+req.session.username+'\'';
    var sql_create_group = 'insert into groups (groupname,creator) values (' + groupname
    + ',' + creator + ');'
    var sql_create_user_group_relationship = 'insert into user_group (groupid,userid) values \
    ((select id from groups where groupname = ' + groupname +'),\
    (select id from userinfo where username = '+creator+'));'
    db.sql(sql_create_group+sql_create_user_group_relationship,function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        res.send({"status":"success"});
    });  
});


router.delete('/', function(req, res, next) {
    console.log(req.body)
    var groupid = req.body.groupid;
    var username = '\''+req.session.username+'\'';
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
        }else{
          db.sql('delete from groups where id='+groupid+';\
          delete from user_group where groupid ='+groupid+';', function(err, result) {
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
