var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb){ // 사용자가 전송한 파일을 어느 디렉토리에 저장할지 결정.
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){  // 디렉토리에 저장할 파일이름을 어떻게 저장할지 결정.
    cb(null, file.originalname);
  }
});
// diskStorage() 함수 내부에는 객체리터럴방식의 메서드가 선언된것.
// 함수내부에서 if문을 사용해 좀 더 디테일한 파일 관리가 가능하다는 장점이 있음.
var upload = multer({storage: storage});  //서버에 저장되어지는 부분을 좀 더 섬세히 가공하자.

var mysql = require('mysql');
var conn = mysql.createConnection({ //createConnection()메서드 호출로 데이터베이스 객체를 받아온다.
  host     : 'localhost',
  user     : 'root',
  password : process.env.MySQL_DB,
  database : 'o2'
});
conn.connect(); // 데이터베이스에 접속한다.

var app = express();

app.locals.pretty = true;
app.set('views', './views/mysql');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
app.use('/user', express.static('uploads'));  //이미지 업로드 폴더를 정적으로 접근하고 할 때 사용자 라우터를 지정하면서 static로 지정할 수 있다. localhost:3000/user/img_0302.jpg

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded.' + req.file.filename);
});

app.get('/topic/add', function(req, res){
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('topic/add', {topics:topics});
  });
});
app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
  conn.query(sql, [title, description, author], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/' +result.insertId);
    }
  });
});
app.get(['/topic/:id/edit'], function(req, res){
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('topic/edit', {topics:topics, topic: topic[0]});
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});
app.post(['/topic/:id/edit'], function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, description=?, author=? WhERE id=?';
  conn.query(sql, [title, description, author, id], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      // console.log(result); 업데이트에 대한 결과를 먼저 확인해 보자.
      res.redirect('/topic/' + id);
    }
  });
});
app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT id, title FROM topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields){
    var sql = 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, topic){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        if(topic.length === 0){
          console.log('There is no id.');
          res.status(500).send('Internal Server Error');
        }
        res.render('topic/delete', {topics: topics, topic: topic[0]});
      }
    });
  });
});
app.post('/topic/:id/delete', function(req, res){
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], function(err, result){
    res.redirect('/topic');
  });
});
app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('topic/view', {topics:topics, topic: topic[0]});
      });
    } else {
      res.render('topic/view', {topics:topics});  // view파일로 전달되어질 결과물은 객체로 전달되어짐.
    }
  });
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
