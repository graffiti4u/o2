//- 패스포트에서 로그인에 성공했을때 req객체에 user객체를 넘겨주는것을 기억하자.

module.exports = function(){
  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  route.get('/add', function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('topic/add', {topics:topics, user:req.user});
    });
  });

  route.post('/add', function(req, res){
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

  route.get(['/:id/edit'], function(req, res){
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
            res.render('topic/edit', {topics:topics, topic: topic[0], user:req.user});
          }
        });
      } else {
        console.log('There is no id.');
        res.status(500).send('Internal Server Error');
      }
    });
  });

  route.post(['/:id/edit'], function(req, res){
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

  route.get('/:id/delete', function(req, res){
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
          res.render('topic/delete', {topics: topics, topic: topic[0], user:req.user});
        }
      });
    });
  });

  route.post('/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, result){
      res.redirect('/topic');
    });
  });

  route.get(['/', '/:id'], function(req, res){
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
          res.render('topic/view', {topics:topics, topic: topic[0], user:req.user});
        });
      } else {
        res.render('topic/view', {topics:topics, user:req.user});  // view파일로 전달되어질 결과물은 객체로 전달되어짐.
      }
    });
  });

  return route;
};
