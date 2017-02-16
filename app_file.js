var express = require('express');
var app = express();  //express 모듈에 있는 express함수를 호출하면 웹서버 객체가 생성된다.

app.locals.pretty = true; //html 소스보기 했을 때 jade로 만들어진 파일을 beautify하게 만들어 줌.
app.set('views', './views_file');
app.set('view engine', 'jade');

app.get('/topic/new', function(req, res){
  res.render('new');
});
app.post('/topic', function(req, res){
  res.send('Hi, POST!');
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
