var fs = require('fs');
var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router({ mergeParams: true });
var db = require('../util/db');
// const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

var upload = multer({ dest: 'public/upload_tmp/' });

function exam_repeat_filename(cnt, filename, path, callback) {
  var filepath = path + filename
  if (cnt != 0) {
    var tmp = filename.split('.')
    filepath = path + tmp[0] + '_' + cnt.toString() + '.' + tmp[1]
  }
  db.sql('select 1 from chat where type = 2 and filepath = \'' + filepath + '\'',
    function (err, result) {
      if (err) {
        console.log("sql错误", err);
        throw new Error('Sql error')
      }
      if (result.recordset.length == 0) {
        callback(filename, filepath)
      } else {
        cnt += 1
        exam_repeat_filename(cnt, filename, path, callback)
      }
    });
}

router.post('/', upload.any(), function (req, res, next) {
  console.log(req.files);  // 上传的文件信息
  var chat_id = req.params.chatid
  var file = req.files[0]
  var filepath = "/upload/chat/";
  exam_repeat_filename(0, file.originalname, filepath,
    function (filename, filepath) {
      db.sql('insert into chat (type,chat_id,filename,filepath,sender) values (2,\'' +
        chat_id + '\',\'' + filename + '\',\'' + filepath + '\',\'' + req.session.username + '\')', function (err, result) {
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
            res.send({ "status": "success","filename":filename, "filepath":filepath });
            return
          }
        });
      });
    });
});


module.exports = router;