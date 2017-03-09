var express = require('express');
var cookieParser = require('cookie-parser'); //쿠키를 사용하기 위해 쿠키 모듈 설치.
var app = express();

app.use(cookieParser('ief3kdkf0-04u5lj32rdkgjfgjb'));  // 쿠키를 사용하기 위해 cookieParser 미들웨어를 설치해 준다.
// 1. 쿠키를 암호화 하기 위해 키값을 랜덤하게 셋팅해 준다.

// 데이터베이스 대용으로 쿠키로 보내고자 하는 데이터를 객체 샘플로 생성.
var products = {
  1: {title: 'The history of web 1'},
  2: {title: 'The next web'},
  3: {title: 'The history of web 2'}
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
/* 사용자의 브라우져에 저장할 데이터를 어떤 형식으로 저장할지를 정함.
cart = {
  제품아이디 : 제품개수
  1:1,
  2:1,
  3:0 ==> cart에 한번도 등록되지 않은 id일 경우를 생각.
}
*/
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart){
    var cart = req.signedCookies.cart;
  } else {
    var cart = {};
  }
  if(!cart[id]){  //cart에 한번도 등록되지 않은 id일 경우를 생각.
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id]) + 1;
  res.cookie('cart', cart, {signed: true});
  console.log(cart);
  res.redirect('/cart');
});
app.get('/cart', function(req, res){
  var cart = req.signedCookies.cart;  //사용자가 보낸 cart에 대한 쿠키값을 받는다.
  if(!cart){
    res.send('Empty!');
  } else {
    var output = '';
    for(var id in cart){  //cart변수는 객체를 담고 있는 데이터이므로 각각의 객체를 추출하기 위해 for in
      output += `<li>${products[id].title} (${cart[id]}) <a href="/cart/${id}/delete">delete</a></li>
      `;
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>
    `);
});
app.get('/cart/:id/delete', function(req, res){
  var id = req.params.id;
  var cart = req.signedCookies.cart;  // 쿠키 파싱시 암호화작업을 유지해야 한다.
  cart[id] = undefined;
  res.cookie('cart', cart, {signed: true});
  res.redirect('/cart');
});

app.get('/count', function(req, res){
  var count = 0;
  if(req.signedCookies.count){  // 2. 브라우져가 요청할 때 넘어온 쿠키를 암호화 한다.
     count = parseInt(req.signedCookies.count);  //쿠기값은 문자로 전송되기 때문에 계산을 위해서는 숫자로 전환.
  } else {
     count = 0;
  }
  count += 1;
  // count라우트로 접속했을시 응답할 때 쿠키의 값을 셋팅하고 브라우져에게 보내자.
  res.cookie('count', count, {signed: true}); // 쿠키를 구워서 클라이언트에게 보낼 때도 암호화해서 보낸다.
  res.send('count : ' + count); //웹브라우저가 웹서버에게 전송(요청)한 데이터를 확인 할 수 있다.
  //쿠키는 동일한 주소에서 셋팅 되었을 때 데이터 상태가 유지된다. 다른 주소로의 접속 시 쿠키는 인식을 하지 않는다.

});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
