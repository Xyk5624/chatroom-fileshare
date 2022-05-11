var express = require('express');
var router = express.Router();
var db = require('../util/db');
var crypto = require('crypto');

/* GET user listing. */
router.post('/', function(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    db.sql('select username,password,email from userinfo where username = \''+username+'\'', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            return;
        }
        console.log(result);
        if (result.recordset.length==0 || 
            result.recordset[0].password!=crypto.createHash('md5').update(password).digest("hex")){
            res.send({status: "fail", message:"用户名或密码错误"});
        }else{
            req.session.username = username; // 登录成功，设置 session
            console.log(req.session.username)
            res.send({status: "success", username: username, email: result.recordset[0].email});
        }
    });
});

router.delete('/', function(req, res, next) {
    req.session.userName = null; // 删除session
    res.send({status: "success"});
});

module.exports = router;
