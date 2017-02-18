var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads/'}); //파일이 저장될 경로를 지정.
var app = express();

app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  // 미들웨어는 req객체에 file이라는 프로퍼티를 암시적으로 추가한다.
  // single()의 인자는 폼에서 지정한 변수명을 써 준다.
  // file 프로퍼티는 사용자가 전송한 파일에 대한 상세정보를 포함하고 있다.
  console.log(req.file);
  res.send('Uploaded.' + req.file.filename);
  // 실제 서버에 전송되어 저장된 파일의 이름은 서버가 임의로 파일이름을 생성해 버린다.
  // 사용자가 전송한 파일의 이름을 그대로 서버로 저장하는 방법을 생각해 보자.
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
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if(id){
      fs.readFile('data/' + id, 'utf8', function(err, data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics:files, title:id, description:data});
      });
    } else {
      res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for server'});
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
