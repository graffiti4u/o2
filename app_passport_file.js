// todo 해결법
/*jshint loopfunc: true */

var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
// 1. 모듈 설정
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

// 2. 미들웨어 설정
app.use(passport.initialize());
app.use(passport.session());

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
  hasher({password: req.body.password}, function(err, pass, salt, hash){
    var user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    users.push(user); // form에서 입력받은 사용자 정보를 배열에 푸쉬
    console.log(users);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
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

// 6. 5번과정의 done함수가 실행되면 다음으로 session 설정과정 진행.
// 5과정에서 실행되어지는 done(null, user) 메서드에 의해 전달되어지는 user객체를 콜백함수에서 그대로 사용할 수 있다.
passport.serializeUser(function(user, done) {
  console.log('serializeUser : ', user);
  done(null, user.username); // 로그인 인증확인에 성공한 유저에 대한 고유 식별자(보통 id값을 사용)를 가지고 세션에 등록됨.(username이 세션 데이터로 저장되고 있음.)
  // 예제에서는 배열데이터에서 id를 만들지 않고 username을 이용한 것임.
});

// 7. serializeUser() 메서드에 의해 세션데이터가 등록된 상태라면 위의 메서드를 실행하지 않고 deserializeUser()메서드가 실행되어짐.
passport.deserializeUser(function(id, done) { // id는 user.username의 값을 받음.
  // 사용자를 검색하는 과정 코딩
  console.log('deserializeUser : ', id);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.username === id){
      return done(null, user);
    }
  }
});

// 4. LocalStrategy 전략을 설정하기 위한 미들웨어 설정
passport.use(new LocalStrategy(
  function(username, password, done){  // LocalStrategy전략이 실행될때 실행되어지는 콜백함수 임.
    // 5. 폼에서 입력받은 데이터를 비교하는 로직을 작성
    var uname = username;
    var pwd = password;
    // 사용자가 이젠 다중사용자이므로 users에 담긴 내용을 모두 확인해 봐야한다.
    for(var i=0; i<users.length; i++){
      var user = users[i];
      if(uname == user.username) {
        // retrun 문을 사용하여 hasher함수 내부의 콜백함수가 제대로 실행될 수 있게 만들어준다.
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password) {
            console.log('LocalStrategy : ', user);
            // done메서드의 첫번째 매개변수는 로그인 과정시 에러가 발생할 때의 에러 메시지.
            done(null, user); //done 함수에 의해 로그인 과정을 마친 사용자 정보가 req.user객체로 만들어 진다. 객체가 3과정의 successRedirect로 연결됨
            // 아래 코딩은 필요 없어짐.
            // req.session.displayName = user.displayName;
            // req.session.save(function(){
            //   res.redirect('/welcome');
            // });
          } else {
            done(null, false);  // 로그인 과정이 끝났는데 실패했다는 의미. false정보가 3과정의 failureRedirect로 연결됨.
            // res.send('Who are you? <a href="/auth/login">login</a>');
          }
        });
      }
    }
    done(null, false);
    // for문이 완료되었는데도 찾고자 하는 유저가 없었을 경우의 코드
    // res.send('Who are you? <a href="/auth/login">login</a>');
  }
));

// 3. 기존의 콜백함수 대신 미들웨어를 사용하여 passport에게 위임하는 코드 설정.
app.post(
  '/auth/login',
  passport.authenticate(
    'local',  // local 전략(strategy)이 실행되게 됨
    { successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false //인증실패에 대한 정보를 사용자에게 메시지를 보여주고자 할때 true 사용
      // LocalStrategy 과정에서 done()메서드의 실패시 done(null, false) 메시지를 추가할 수 있는데 그 메시지를 다음 페이지로 함께 보내고자 할 때 true 사용한다. ex. done(null, false, {message:'Incorrect username'})
    }
  ));

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
