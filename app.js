var express = require('express');
var app = express();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'));

app.get('/topic/:id', function(req, res){
  // 사용자 id값에 따라 각각 다른 정보를 보이게 하기 위해 배열로 테스트하기
  var topics = [
    'javascript is ...',
    'Nodejs is ...',
    'Express is ...'
  ];
  var output = `
    <a href="/topic?id=0">javascript</a><br>
    <a href="/topic?id=1">Nodejs</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    ${topics[req.params.id]}
  `;
  res.send(output);
});
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id + ',' + req.params.mode);
});
app.get('/template', function(req, res){
  res.render('temp', {time:Date(), _title:'Jade'});
});
app.get('/', function(req, res){
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
