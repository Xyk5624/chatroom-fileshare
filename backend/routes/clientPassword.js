var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var email_util = require('../util/email');
var db = require('../util/db');


router.get('/', function(req, res, next) {
    var email = req.query.email
    var code = email_util.randomFns()
    
    email_util.transport.sendMail({
        from: '861578244@qq.com', // 发件邮箱
        to: email, // 收件列表
        subject: '验证你的电子邮件', // 标题
        html: `
        <p>你好！</p>
        <p>您正在修改密码</p>
        <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
        <p>***该验证码5分钟内有效***</p>` // html 内容
        }, function(error, data) {
        email_util.transport.close();
        if (error){
            res.send({status: "fail",message: "验证码发送失败"});
        }else{
            res.send({status: "success"})
        }
    })
    email_util.code_dict[email] = code
    console.log(email_util.code_dict)
});

router.put('/', function(req, res, next) {
    var email = req.body.email
    var username = '\''+req.body.username+'\''
    var code = req.body.code
    var password = req.body.password;
    password = crypto.createHash('md5').update(password).digest("hex")
    password = '\'' + password + '\''
    if (code == email_util.code_dict[email]){
        db.sql('UPDATE userinfo SET password = ' + password +' WHERE username = '+username, function(err, result) {
            if(err) {
                console.log("sql错误", err);
                res.send({"status":"fail","message":err.message});
                return;
            }
            delete email_util.code_dict[email]
            res.send({"status":"success"});
        }); 
    }else{
        res.send({"status":"fail","message":"验证码错误"});;
    }
});

module.exports = router;
