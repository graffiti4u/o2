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
app.set('views', './views_orientdb');
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
app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });
});
app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    console.log(topics);
    var id = req.params.id;
    if(id){
      var sql = 'SELECT FROM topic WHERE @rid = :rid';
      db.query(sql, {params:{rid:id}}).then(function(topic){
        console.log(topic[0]);
        // id값에 해당되는 하나의 레코드를 호출했는데 레코드 자체가 배열로 만들어진 객체이므로 배열의 첫번째 요소를 잡아내기위해(객체) topic[0]으로 처리.
        res.render('view', {topics:topics, topic:topic[0]});
      });
    } else {
      res.render('view', {topics:topics});
    }
  });
});

app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/' + title);
  });
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
