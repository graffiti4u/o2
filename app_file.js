var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));

app.get('/topic/new', function(req, res){
  res.render('new');
});
app.get('/topic', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('view', {topics: files});
  });
});
app.get('/topic/:id', function(req, res){
  var id = req.params.id;
  fs.readdir('data', function(err, files){
  // 목록을 일단 위에 뿌려주기 위해 readdir()함수를 호출
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    fs.readFile('data/' + id, 'utf8', function(err, data){
    // 해당 파일의 실제 내용을 읽어들이기 위해 readFile() 호출
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('view', {topics:files, title:id, description:data});
    });
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
    res.send('Success!');
  });
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
