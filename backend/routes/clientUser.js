var fs = require('fs');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require('../util/db');

var upload = multer({ dest: 'public/upload_tmp/' });

router.get('/', function (req, res, next) {
  var username = '\'' + req.session.username + '\''
  db.sql('select * from userinfo where username = ' + username, function (err, result) {
    if (err) {
      console.log("sql错误", err);
      res.send({ "status": "fail", "message": err.message });
      return;
    }
    console.log(result.recordset)
    res.send({ "status": "success", "user": result.recordset });
  });
});

router.put('/', upload.any(), function (req, res, next) {
  console.log(req.files);  // 上传的文件信息
  var username = req.session.username
  var file = req.files[0]
  var filename = username + '.' + file.originalname.split('.')[1]
  var filepath = "/upload/avatar/" + filename
  db.sql('UPDATE userinfo SET avatar = \'' + filepath +'\' WHERE username = \''+username+'\';', function (err, result) {
      if (err) {
        console.log("sql错误", err);
        res.send({ "status": "fail", "message": err });
        return
      }
    });
  fs.readFile(file.path, function (err, data) {
    fs.writeFile("./public" + filepath, data, function (err) {
      if (err) {
        console.log(err);
        res.send({ "status": "fail", "message": err });
        return
      } else {
        res.send({ "status": "success", "filepath": filepath });
        return
      }
    });
  });
});

module.exports = router;