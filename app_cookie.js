var express = require('express');
var cookieParser = require('cookie-parser'); //쿠키를 사용하기 위해 쿠키 모듈 설치.
var app = express();

app.use(cookieParser());  //쿠키를 사용하기 위해 cookieParser 미들웨어를 설치해 준다.

// 데이터베이스 대용으로 쿠키로 보내고자 하는 데이터를 객체 샘플로 생성.
var products = {
  1: {title: 'The history of web 1'},
  2: {title: 'The next web'}
};
app.get('/products', function(req, res){
  var output = '';
  for(var name in products){   //객체에 있는 각 요소를 추출하기 위해서는 for in 문으로 반복한다. 반복되어져서 추출되는 각각의 정보는 객체 속성(1 , 2)을 출력해 준다.
    output += `
    <li>
      <a href="/cart/${name}">${products[name].title}</a>
    </li>
    `;
    console.log(products[name].title);  // products객체의 각 2차 객체를 추출하기 위해 배열을 사용하고 배열의 요소로 products객체의 각각의 프로퍼티를 이용했다.
  }
  res.send(`<h1>Products</h1><ul>${output}</ul>
    <a href="/cart">Cart</a>`);
});

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
