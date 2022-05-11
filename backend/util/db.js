var config = require('../config/config');
var mssql = require('mssql');

var db = {};
var sqlserver_config = config.sqlserver;
 
//执行sql,返回数据.
db.sql = function (sql, callBack) {
  console.log("sql", sql)
  var connection = new mssql.ConnectionPool(sqlserver_config, function (err) {
    if (err) {
      console.log(err);
      callBack(err,null);
      return;
    }
    var ps = new mssql.PreparedStatement(connection);
    ps.prepare(sql, function (err) {
      if (err){
        console.log(err);
        callBack(err,null);
        return;
      }
      ps.execute('', function (err, result) {
        if (err){
          console.log(err);
          callBack(err,null);
          return;
        }
 
        ps.unprepare(function (err) {
          if (err){
            console.log(err);
            callBack(err,null);
            return;
          }
            callBack(err, result);
        });
      });
    });
  });
};
 
module.exports = db;