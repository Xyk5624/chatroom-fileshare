var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientSessionRouter = require('./routes/clientSession');
var clientFilesRouter = require('./routes/clientFiles');
var clientPasswordRouter = require('./routes/clientPassword');
var clientGroupsRouter = require('./routes/clientGroups');
var clientGroupUsersRouter = require('./routes/clientGroupUsers');
var clientGroupFilesRouter = require('./routes/clientGroupFiles');
var clientChatRouter = require('./routes/clientChat');
var clientChatFilesRouter = require('./routes/clientChatFiles');
var clientGroupChatRouter = require('./routes/clientGroupChat');
var clientGroupChatFilesRouter = require('./routes/clientGroupChatFiles');
var clientFriendsRouter = require('./routes/clientFriends');
var clientExistedUserRouter = require('./routes/clientExistedUser');
var clientUserRouter = require('./routes/clientUser');
var clientUsersRouter = require('./routes/clientUsers');
var cmsSessionRouter = require('./routes/cmsSession');


var app = express();
app.use(cors({
  origin: ['http://localhost:8080','http://localhost:8081','http://192.168.90.44:8081'],
  credentials: true,
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  saveUninitialized: true, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 60, // 设置 session 的有效时间，单位毫秒
  },
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next){
  console.log(req.session)
  if (req.url.slice(0,10) == '/socket.io'){
    next()
  }else if (req.url!='/cms/session'&&req.url!='/client/session'&&!req.session.username){
    res.status(403);
    res.send();
  }else{
    next()
  }
})


app.use('/', indexRouter);
// app.use('/client/users', usersRouter);
app.use('/client/session', clientSessionRouter);
app.use('/client/password', clientPasswordRouter);
app.use('/client/files', clientFilesRouter);
app.use('/client/groups', clientGroupsRouter);
app.use('/client/groups', clientGroupsRouter);
app.use('/client/group/:groupid/users', clientGroupUsersRouter);
app.use('/client/group/:groupid/files', clientGroupFilesRouter);
app.use('/client/group/:groupid/chat', clientGroupChatRouter);
app.use('/client/group/:groupid/chat/files', clientGroupChatFilesRouter);
app.use('/client/chat', clientChatRouter);
app.use('/client/chat/:chatid/files', clientChatFilesRouter);
app.use('/client/existeduser', clientExistedUserRouter);
app.use('/client/friends', clientFriendsRouter);
app.use('/client/user', clientUserRouter);
app.use('/client/users', clientUsersRouter);
app.use('/cms/session', cmsSessionRouter);
app.use('/cms/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
