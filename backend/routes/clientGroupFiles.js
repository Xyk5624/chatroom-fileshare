var fs = require('fs');
var express = require('express');
var multer  = require('multer');
var path = require('path');
var router = express.Router({ mergeParams: true });
var db = require('../util/db');
// const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

var upload = multer({dest: 'public/upload_tmp/'});

function exam_repeat_filename(cnt,filename,path,callback){
    var filepath = path+filename
    if (cnt != 0){
        var tmp = filename.split('.')
        filepath = path+tmp[0]+'_'+cnt.toString()+'.' + tmp[1]
    }
    db.sql('select 1 from upload_group_files where filepath = \''+filepath+'\'', 
    function(err, result) {
        if(err) {
            console.log("sql错误", err);
            throw new Error('Sql error')
        }
        if (result.recordset.length==0){
            callback(filename,filepath)
        }else{
            cnt += 1
            exam_repeat_filename(cnt,filename,path,callback)
        }
    });
}

router.post('/', upload.any(), function(req, res, next) {
    console.log(req.files);  // 上传的文件信息
    var groupid = req.params.groupid;
    var finish_cnt = 0;
    req.files.forEach(file => {
        var filepath = "/upload/group/";
        exam_repeat_filename(0,file.originalname,filepath,
            function(filename,filepath){
                db.sql('insert into upload_group_files (filename,filepath,uploader,groupid) values (\''+
                filename+'\',\''+filepath+'\',\''+req.session.username+'\','+groupid+');', function(err, result) {
                    if(err) {
                        console.log("sql错误", err);
                        res.send({"status":"fail","message":err});
                        return 
                    }
                });
                fs.readFile(file.path, function (err, data) {
                    fs.writeFile("./public"+filepath, data, function (err) {
                        if( err ){
                            console.log( err );
                            res.send({"status":"fail","message":err});
                            return
                        }else{
                            finish_cnt += 1;
                            if (finish_cnt == req.files.length){
                                res.send({"status":"success"});
                            }
                        }
                    });
                });
        });
    })           
});

router.get('/', function(req, res, next) {
    console.log(req.session)
    var groupid = req.params.groupid;
    db.sql('select * from upload_group_files where groupid = '+groupid+'order by createtime desc;', function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        res.send({"status":"success","files":result.recordset});
    });
});

router.delete('/', function(req, res, next) {
    var filepath = '\''+req.body.filepath+'\''
    fs.unlinkSync('./public'+req.body.filepath);
    db.sql('delete from upload_group_files where filepath = '+filepath, function(err, result) {
        if(err) {
            console.log("sql错误", err);
            res.send({"status":"fail","message":err.message});
            return;
        }
        res.send({"status":"success"});
    });
});


module.exports = router;