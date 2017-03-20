var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret: 'jkdk3$6@#%&kdfkj#@4590fd',
  resave: false,
  saveUninitialized: true
  // secret – 쿠키를 임의로 변조하는것을 방지하기 위한 값 입니다. 이 값을 통하여 세션을 암호화 하여 저장합니다.
  // resave – 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값입니다. express-session documentation에서는 이 값을 false 로 하는것을 권장하고 필요에 따라 true로 설정합니다.
  // saveUninitialized – 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장합니다.
  // , cookie: { secure: true } proxy를 이용한 https 프로토콜을 사용시 세션을 이용하는 방법 추후 스터디.
}));

app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : ' + req.session.count);
  // req.session 에 의해 클라이언트의 쿠키에 connect.pid라는 쿠키변수가 저장되고 이 정보에 의해 서버접속시 쿠키변수값과 동일한 쿠키정보를 서버에서 찾아 데이터를 활용하게 됨.
});

app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  console.log(req.session); //세션정보가 삭제되었는지 확인.
  res.redirect('/welcome');
});

app.get('/welcome', function(req, res){
  // 로그인에 성공한 상태와 로그인에 실패한 상태를 구분해 처리
  // 세션정보 확인으로 로그인 되어진 유져의 개인 정보페이지를 구현할 수 있다.
  if(req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a>
    `);
  }
});

app.post('/auth/login', function(req, res){
  var user = {
    username: 'egoing',
    password: '111',
    displayName: 'Eging'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  // 로그인(id, password)을 처리하는 로직을 넣는데 보통 DB를 사용하지만 이번 예제에서는 객체로 테스트.
  if(uname == user.username && pwd == user.password){
    req.session.displayName = user.displayName;
    res.redirect('/welcome'); //로그인 성공시 welcome 라우터로 리다이렉션.
  } else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
});

app.get('/auth/login', function(req, res){
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;
  res.send(output);
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
