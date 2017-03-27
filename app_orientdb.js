var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});
var upload = multer({storage: storage});

var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: process.env.Orient_DB // 비밀번호 같은경우 설정파일을 따로 만들어 로딩하거나 환경변수로 처리해서 보안에 유의해야 한다.
});

var db = server.use('o2');  // DB를 지정해 준다.

var app = express();

app.locals.pretty = true;
app.set('views', './views/orientdb');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
app.use('/user', express.static('uploads'));

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded.' + req.file.filename);
});

var topic = require('./routes/orientdb/topic')();
app.use('/topic', topic);


app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
