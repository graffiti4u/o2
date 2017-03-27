module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var OrientoStore = require('connect-oriento')(session);
  var bodyParser = require('body-parser');

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

  return app;
};
