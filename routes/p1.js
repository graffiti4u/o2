
var express = require('express'); // express의 Router() 메서드를 사용하기 위해 설정해 줘야 함.
var route = express.Router();

route.get('/r1', function(req, res){
  res.send('Hello /p1/r1');
});
route.get('/r2', function(req, res){
  res.send('Hello /p1/r2');
});

module.exports = route;
