module.exports = function(passport){
  var route = require('express').Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var db = require('../../config/orientdb/db')();

  route.get('/logout', function(req, res){
    // 9. logout 되었을 때 passport에서 지원되는 메서드로 사용.
    req.logout();
    req.session.save(function(){ // 로그아웃에 의해 세션데이터를 없애는 작업이 save 되면 실행되게 설정.
      res.redirect('/welcome');
    });
  });

  route.post('/register', function(req, res){
    hasher({password: req.body.password}, function(err, pass, salt, hash){
      var user = {
        // 패이스북 구조와 동일하게 만들기 위해 속성 추가.
        authId: 'local:' + req.body.username,
        username: req.body.username,
        password: hash,
        salt: salt,
        displayName: req.body.displayName
      };
      var sql = 'INSERT INTO user(authId, username, password, salt, displayName) VALUES (:authId, :username, :password, :salt, :displayName)';
      db.query(sql, {
        params: user
      }).then(function(results){
        //8. 회원가입과 동시에 로그인되어진 상태로 만들어주기 위해 passport방식의 코딩을 한다.
        req.login(user, function(err){
          req.session.save(function(){
            res.redirect('/welcome');
          });
        });
      }, function(error){ //프라미스에서는 첫번째 함수는 이전 처리가 정상적으로 마무리되었을 때 실행되고 만약 에러가 발생하면 두번째 함수가 실행되게 함.
        console.log(error);
        res.status(500);
      });
    });
  });

  route.get('/register', function(req, res) {
    res.render('auth/register');
  });

  // 3. 기존의 콜백함수 대신 미들웨어를 사용하여 passport에게 위임하는 코드 설정.
  route.post(
    '/login',
    passport.authenticate(
      'local',  // local 전략(strategy)이 실행되게 됨
      { successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false //인증실패에 대한 정보를 사용자에게 메시지를 보여주고자 할때 true 사용
        // LocalStrategy 과정에서 done()메서드의 실패시 done(null, false) 메시지를 추가할 수 있는데 그 메시지를 다음 페이지로 함께 보내고자 할 때 true 사용한다. ex. done(null, false, {message:'Incorrect username'})
      }
    ));

  // f1. 라우팅을 받을
  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      // 페이스북의 다른 정보를 더 가져오고 싶을때 scope를 사용
      {scope: 'email'}
    )
  );

  // f3. 미들웨어에서 인증절차를 마치면 실행될 라우팅
  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/Welcome',
        failureRedirect: '/auth/login'
      }
    )
  );

  route.get('/login', function(req, res){
    res.render('auth/login');
  });

  return route;
};
