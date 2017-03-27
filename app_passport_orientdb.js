// todo 해결법
/*jshint loopfunc: true */

var express = require('express');
var session = require('express-session');
var OrientoStore = require('connect-oriento')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
// 1. 모듈 설정
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var db = require('./config/orientdb/db')();

var app = express();

// 1. views 템플릿을 사용하기 위해 엔진 셋팅
app.locals.pretty = true;
app.set('views', './views/orientdb');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret: 'jkdk3$6@#%&kdfkj#@4590fd',
  resave: false,
  saveUninitialized: true,
  store: new OrientoStore({
    server: "host=localhost&port=2424&username=root&password="+ process.env.Orient_DB + "&db=o2"
  })
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

// 비밀번호를 암호화하기 위한 소금치기
var users = [
  // 기본적으로 테스트했던 사용자 정보를 하나 등록해 둔다.
  {
    // 패이스북 구조와 동일하게 만들기 위해 속성 추가.
    authId: 'local:egoing',
    username: 'egoing',
    password: 'BdyQmF0yzJ97Tv3BEc23skwqUuq7aO9MpC76BD786T+EeKkNt33lX5kggkzd+QD9qJI1+eXwcLIFUAPXVzmyIZAA1ShX1z4J723m2WZ12xH0wHMKhMDm1LlQDgyktcFLRnpVwIewcOUmc5PgELFM8o9eYsK+z23MOk3mSUFP9RA=', // 패스워드 111111 로 암호화한 결과값
    salt: '64TqkJ9gOsRGmoe9Ad8OI7gW8pMuv+yTl9M1mEqaIzUOKULdjCfCGiNABU5RyBTyFqndmrFwkl4j8UwidFUN1w==',
    displayName: 'Egoing'
  }
];

// 6. 5번과정의 done함수가 실행되면 다음으로 session 설정과정 진행.
// 5과정에서 실행되어지는 done(null, user) 메서드에 의해 전달되어지는 user객체를 콜백함수에서 그대로 사용할 수 있다.
passport.serializeUser(function(user, done) {
  console.log('serializeUser : ', user);
  done(null, user.authId); // 로그인 인증확인에 성공한 유저에 대한 고유 식별자(보통 id값을 사용)를 가지고 세션에 등록됨.(username이 세션 데이터로 저장되고 있음.)
  // 예제에서는 배열데이터에서 id를 만들지 않고 username을 이용한 것임.
});

// 7. serializeUser() 메서드에 의해 세션데이터가 등록된 상태라면 위의 메서드를 실행하지 않고 deserializeUser()메서드가 실행되어짐.
passport.deserializeUser(function(id, done) { // id는 user.username의 값을 받음.
  // 사용자를 검색하는 과정 코딩
  console.log('deserializeUser : ', id);
  var sql = 'SELECT displayName FROM user WHERE authId=:authId';
  db.query(sql, {params:{authId: id}}).then(function(results){
    if(results.length === 0) {
      done('There is no user.');
    } else {
      done(null, results[0]);
    }
  });
});

// 4. LocalStrategy 전략을 설정하기 위한 미들웨어 설정
passport.use(new LocalStrategy(
  function(username, password, done){  // LocalStrategy전략이 실행될때 실행되어지는 콜백함수 임.
    // 5. 폼에서 입력받은 데이터를 비교하는 로직을 작성
    var uname = username;
    var pwd = password;
    // 데이터베이스에서 사용자 정보를 추출해내서 이용.
    var sql = 'SELECT * FROM user WHERE authId=:authId';
    db.query(sql, {params:{authId: 'local:'+uname}}).then(function(results){
      var user = results[0];  // hasher함수의 내용을 그대로 사용하기 위해 배열의 첫번째 객체를 추출.
      if(results.length === 0){
        return done(null, false);
      }
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
    });
  }
));

// f2. 패이스북 정책에 맞는 미들웨어 실행
passport.use(new FacebookStrategy({
    clientID: '586789948193727',  //FACEBOOK_APP_ID
    clientSecret: 'a5aa7c1c3dfaa3e6652d148c2e7fd522',  //FACEBOOK_APP_SECRET
    callbackURL: "/auth/facebook/callback", // id값과 secret코드의 검증을 마친후 보내질 url
    // 추가로 얻고자 하는 페이스북 정보를 주고자 할 때.
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  // f4. id와 secret 검증을 마치면 실행되는 콜백함수
  function(accessToken, refreshToken, profile, done) {
    console.log('FacebookStrategy', profile); // 프로파일을 확인해 보면 id값이 확인되는데 이 값이 패이스북의 고유식별자 id임.
    var authId = 'facebook:' + profile.id;
    // 사용자가 이미 등록되어진 사용자인지 아닌지를 확인하고 처리하자.
    var sql = 'SELECT FROM user WHERE authId = :authId';
    db.query(sql, {params: {authId:authId}}).then(function(results){
      if(results.length === 0) {
        var newUser = {
          'authId': authId,
          'displayName': profile.displayName,
        //'email': profile.emails[0].value  // 추가적인 정보를 더 넣어서 관리할 수도 있다.
        };
        var sql = 'INSERT INTO user (authId, displayName, email) VALUES (:authId, :displayName, :email)';
        db.query(sql, {params: newUser}).then(function(results){
          done(null, newUser);
        }, function(error){
          console.log(error);
          done('Error');
        });
      } else {
        return done(null, results[0]);
      }
    });
  }
));

var auth = require('./routes/orientdb/auth')(passport);
app.use('/auth', auth);

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
