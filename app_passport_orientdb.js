// todo 해결법
/*jshint loopfunc: true */

var app = require('./config/orientdb/express')();

// 세션 설정 아래에 해 주어야 함.
var passport = require('./config/orientdb/passport')(app);

var auth = require('./routes/orientdb/auth')(passport);
app.use('/auth', auth);

app.get('/welcome', function(req, res){
  // 로그인에 성공한 상태와 로그인에 실패한 상태를 구분해 처리
  // 세션정보 확인으로 로그인 되어진 유져의 개인 정보페이지를 구현할 수 있다.
  // 패스포트를 이용 유저정보에 접근한다.
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
