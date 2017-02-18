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
var app = express();

app.locals.pretty = true;
app.set('views', './views_file');
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
