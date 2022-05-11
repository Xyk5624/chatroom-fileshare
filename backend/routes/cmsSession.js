var express = require('express');
var router = express.Router();

/* GET user listing. */
router.post('/', function(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    if (username == 'admin' && password == '123456'){
        req.session.username = username; // 登录成功，设置 session
        res.send({status: "success", username: username});
    }else{
        res.send({status: "fail", message:"用户名或密码错误"});
    }
});

router.delete('/', function(req, res, next) {
    req.session.userName = null; // 删除session
    res.send({status: "success"});
});

module.exports = router;
