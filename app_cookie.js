var express = require('express');
var cookieParser = require('cookie-parser'); //쿠키를 사용하기 위해 쿠키 모듈 설치.
var app = express();

app.use(cookieParser());  //쿠키를 사용하기 위해 cookieParser 미들웨어를 설치해 준다.

app.get('/count', function(req, res){
  var count = 0;
  if(req.cookies.count){
     count = parseInt(req.cookies.count);  //쿠기값은 문자로 전송되기 때문에 계산을 위해서는 숫자로 전환.
  } else {
     count = 0;
  }
  count += 1;
  // count라우트로 접속했을시 응답할 때 쿠키의 값을 셋팅하고 브라우져에게 보내자.
  res.cookie('count', count);
  res.send('count : ' + count); //웹브라우저가 웹서버에게 전송(요청)한 데이터를 확인 할 수 있다.
  //쿠키는 동일한 주소에서 셋팅 되었을 때 데이터 상태가 유지된다. 다른 주소로의 접속 시 쿠키는 인식을 하지 않는다.

});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
