module.exports = function(app){
  var express = require('express'); // express의 Router() 메서드를 사용하기 위해 설정해 줘야 함.
  var route = express.Router();

  route.get('/r1', function(req, res){
    res.send('Hello /p1/r1');
  });
  route.get('/r2', function(req, res){
    res.send('Hello /p1/r2');
  });
  app.get('/p3/r1', function(req, res){
    res.send('Hello /p3/r1');
  }); //매개변수로 app을 전달받았기 때문에 app 변수를 사용할 수 있다
  return route;
};
// 처음 코딩되었던 로직을 함수 안으로 넣어서 처리한다.
