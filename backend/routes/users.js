var express = require('express');
var router = express.Router();
var db = require('../util/db');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
    console.log(req.session)
    
    db.sql('select * from userinfo', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        console.log(result.recordset)
        res.send({"status":"success","users":result.recordset});
    });
});

router.put('/', function(req, res, next) {
    var id = req.body.id.toString();
    var username = '\''+req.body.username+'\'';
    var email = '\''+req.body.email+'\'';
    var password = req.body.password;
    password = crypto.createHash('md5').update(password).digest("hex")
    password = '\'' + password + '\''
    db.sql('UPDATE userinfo SET username = ' + username
    +', email = ' + email + ', password = ' + password +
    ' WHERE id = '+ id, function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        res.send({"status":"success"});
    });  
});

router.post('/', function(req, res, next) {
    var username = '\''+req.body.username+'\'';
    var email = '\''+req.body.email+'\'';
    var password = req.body.password;
    password = crypto.createHash('md5').update(password).digest("hex")
    password = '\'' + password + '\''
    console.log(username,email,password)
    db.sql('insert into userinfo (username,email,password) values (' + username
    + ',' + email + ',' + password +')', function(err, result) {
        if(err) {
            console.log("sql错误", err.message);
            res.send({"status":"fail","message":err.message});
            return;
        }
        res.send({"status":"success"});
    });  
});

router.delete('/', function(req, res, next) {
    console.log(req.body)
    var id = req.body.id.toString();
    db.sql('delete from userinfo where id='+id+';\
    delete from friends where userid ='+id+' or friend ='+id+';\
    delete from user_group where userid ='+id, function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        res.send({"status":"success"});
    });  
});

module.exports = router;
