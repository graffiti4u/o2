// 모듀을 함수로 만들어서 함수를 리턴해 줘서 메인에서 사용할 수 있게 만들어준다.

module.exports = function(app){
  var conn = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  // 1. 모듈 설정
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;

  // 2. 미들웨어 설정
  app.use(passport.initialize());
  app.use(passport.session());

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
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
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
      // 데이터베이스에서 로그인 접속 username으로 쿼리 검색.
      var sql = 'SELECT * FROM users WHERE authId = ?';
      conn.query(sql, ['local:'+uname], function(err, results){
        console.log(results);
        if(err){
          return done('There is no user.');
        }
        var user = results[0];
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
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, [authId], function(err, results){
        if(results.length > 0){
          done(null, results[0]);
        } else {
          // 사용자가 없다면
          var newUser = {
            'authId': authId,
            'displayName': profile.displayName
          //'email': profile.emails[0].value  // 추가적인 정보를 더 넣어서 관리할 수도 있다.
          };
          var sql = 'INSERT INTO users SET ?';
          conn.query(sql, newUser, function(err, results){
            if(err){
              console.log(err);
              done('Error');
            } else {
              done(null, newUser);
            }
          });
        }
      });
    }
  ));
  return passport;
};
