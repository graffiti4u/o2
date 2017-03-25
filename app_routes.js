var express = require('express');
var app = express();

var p1 = express.Router();

p1.get('/r1', function(req, res){
  res.send('Hello /p1/r1');
});
p1.get('/r2', function(req, res){
  res.send('Hello /p1/r2');
});
app.use('/p1', p1); // use 미들웨어 함수를 사용하여 p1으로 들어오는 모든 접속 경로는 p1 라우터에게 위임한다.
// 브라우저에서 /p1/..으로 접속하는 라우팅을 모두 처리 함.

var p2 = express.Router();
p2.get('/r1', function(req, res){
  res.send('Hello /p1/r1');
});
p2.get('/r2', function(req, res){
  res.send('Hello /p1/r1');
});
app.use('/p2', p2); // use 미들웨어 함수를 사용하여 p2으로 들어오는 모든 접속 경로는 p2 라우터에게 위임한다.

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
