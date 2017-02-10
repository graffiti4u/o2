var express = require('express');
var app = express();

app.get('/', function(req, res){  //URL로 직접 주소를 적어 서버에 접속할 때는 get메서드가 호출됨.
  res.send('Hello World!');
});

app.get('/login', function(req, res){
  res.send('<h1>Login please.</h1>');
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
