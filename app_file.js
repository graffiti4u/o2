var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();  //express 모듈에 있는 express함수를 호출하면 웹서버 객체가 생성된다.

app.locals.pretty = true; //html 소스보기 했을 때 jade로 만들어진 파일을 beautify하게 만들어 줌.
app.set('views', './views_file');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
// form에 의해 전달되어지는 문자열에는 공백(한칸뛰기)이 있게 되는데 그부분을 "+"기호로 변환할지를 물음.
// 또한 특수문자는 ASCII 16진수 값으로 전환할 것인지를 물음.
// req.body.속성이름으로 해당 데이터에 접근할 수 있게 만들어 줌.

app.get('/topic/new', function(req, res){
  res.render('new');
});
app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err); // 정확한 에러단서를 찾기위해 로그를 확인해 보자.
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  });
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
