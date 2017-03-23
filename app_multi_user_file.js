var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret: 'jkdk3$6@#%&kdfkj#@4590fd',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
  // 세션저장소를 지정해 줄 때 미들웨어에 해당하는 옵션을 잡아주면 된다.
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
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

// 비밀번호를 암호화하기 위한 소금치기
var users = [
  // 기본적으로 테스트했던 사용자 정보를 하나 등록해 둔다.
  {
    username: 'egoing',
    password: 'BdyQmF0yzJ97Tv3BEc23skwqUuq7aO9MpC76BD786T+EeKkNt33lX5kggkzd+QD9qJI1+eXwcLIFUAPXVzmyIZAA1ShX1z4J723m2WZ12xH0wHMKhMDm1LlQDgyktcFLRnpVwIewcOUmc5PgELFM8o9eYsK+z23MOk3mSUFP9RA=', // 패스워드 111111 로 암호화한 결과값
    salt: '64TqkJ9gOsRGmoe9Ad8OI7gW8pMuv+yTl9M1mEqaIzUOKULdjCfCGiNABU5RyBTyFqndmrFwkl4j8UwidFUN1w==',
    displayName: 'Egoing'
  }
];

app.post('/auth/register', function(req, res){
  var user = {
    username: req.body.username,
    password: req.body.password,
    displayName: req.body.displayName
  };
  users.push(user); // form에서 입력받은 사용자 정보를 배열에 푸쉬
  console.log(users);
  req.session.displayName = req.body.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.get('/auth/register', function(req, res) {
  var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="displayName" placeholder="displayName">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;
  res.send(output);
});

app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  // 사용자가 이젠 다중사용자이므로 users에 담긴 내용을 모두 확인해 봐야한다.
  for(var i=0; i<users.length; i++){
    console.log(users);
    var user = users[i];
    if(uname == user.username && sha256(pwd + user.salt) == user.password){
      req.session.displayName = user.displayName;
      return req.session.save(function(){ //return 을 붙여줌으로써 콜백함수 안의 for문이 중단되게 함.
        res.redirect('/welcome');
      });
    }
  }
  res.send('Who are you? <a href="/auth/login">login</a>');
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
