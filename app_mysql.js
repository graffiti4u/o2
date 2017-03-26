// 로그인 했을 때 로그아웃 정보가 뜨지 않은 것은 세션에 대한 설정이 빠져 있었기 때문이다. 해서 세션에 대한 정보를 가지고있는 express파일을 로딩.
var app = require('./config/mysql/express')();

// 라우터 설정
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

// 라우터 선언.
var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
