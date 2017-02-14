var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){  //URL로 직접 주소를 적어 서버에 접속할 때는 get메서드가 호출됨.
  res.send('Hello World!');
});
app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i=0; i<5; i++){
    lis += '<li>coding</li>';
  }
  var time = Date();
  var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>static.html</title>
    </head>
    <body>
      Hello, Dynamic!
      <ul>
      ${lis}
      </ul>
      ${time}
    </body>
  </html>
  `;
  res.send(output);
});
app.get('/login', function(req, res){
  res.send('<h1>Login please.</h1>');
});
app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/route.png">');
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
