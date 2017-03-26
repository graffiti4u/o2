var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.locals.pretty = true;
app.set('views', './views/mysql');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
app.use('/user', express.static('uploads'));  //이미지 업로드 폴더를 정적으로 접근하고 할 때 사용자 라우터를 지정하면서 static로 지정할 수 있다. localhost:3000/user/img_0302.jpg

// 라우터 선언.
var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
