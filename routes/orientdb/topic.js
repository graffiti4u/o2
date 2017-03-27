module.exports = function(){
  var route = require('express').Router();
  var db = require('../../config/orientdb/db')();

  route.get('/add', function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(topics){
      res.render('topic/add', {topics:topics});
    });
  });
  route.post('/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES (:title, :desc, :author)';
    db.query(sql,
      {params:{
        title: title,
        desc: description,
        author: author
      }
    }).then(function(results){  //query 추가가 성공되었을 시 해당 결과는 배열안에 객체로 데이터가 만들어진다. 성공하였을 시 해당 topic의 내용을 보여주는 view.jade가 리다이렉트되어야 하기 때문에 results[0]['@rid']로 rid값만 추출해 내자.
    //encodeURIComponent()함수를 사용하는 이유를 이해할 것.
      res.redirect('/topic/' + encodeURIComponent(results[0]['@rid']));
    });
  });
  route.get('/:id/delete', function(req, res){
    var sql = 'SELECT FROM topic';
    var id = req.params.id;
    db.query(sql).then(function(topics){
      var sql = 'SELECT FROM topic WHERE @rid = :rid';
      db.query(sql, {params:{rid:id}}).then(function(topic){
        console.log(topic[0]);
        // id값에 해당되는 하나의 레코드를 호출했는데 레코드 자체가 배열로 만들어진 객체이므로 배열의 첫번째 요소를 잡아내기위해(객체) topic[0]으로 처리.
        res.render('topic/delete', {topics:topics, topic:topic[0]});
      });
    });
  });
  route.post('/:id/delete', function(req, res){
    var sql = 'DELETE FROM topic WHERE @rid=:rid';
    var id = req.params.id;
    db.query(sql, {
      params: {
        rid: id
      }
    }).then(function(topics){
      res.redirect('/topic/');
    });
  });
  route.get('/:id/edit', function(req, res){
    var sql = 'SELECT FROM topic';
    var id = req.params.id;
    db.query(sql).then(function(topics){
      var sql = 'SELECT FROM topic WHERE @rid = :rid';
      db.query(sql, {params:{rid:id}}).then(function(topic){
        console.log(topic[0]);
        // id값에 해당되는 하나의 레코드를 호출했는데 레코드 자체가 배열로 만들어진 객체이므로 배열의 첫번째 요소를 잡아내기위해(객체) topic[0]으로 처리.
        res.render('topic/edit', {topics:topics, topic:topic[0]});
      });
    });
  });
  route.post('/:id/edit', function(req, res){
    var sql = 'UPDATE topic SET title=:t, description=:d, author=:a WHERE @rid=:rid';
    var id = req.params.id;
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    db.query(sql, {
      params: {
        t: title,
        d: description,
        a: author,
        rid: id
      }
    }).then(function(topics){
      console.log(topics);
      res.redirect('/topic/' + encodeURIComponent(id));
    });
  });
  //라우트의 순서에 따라 다른 경로를 타므로 순서에 주의.('/topic/add')
  // 위의 라우트가 없었다면 아래의 id값으로 add가 들어가 경로를 타게 됨.
  route.get(['/', '/:id'], function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(topics){
      console.log(topics);
      var id = req.params.id;
      if(id){
        var sql = 'SELECT FROM topic WHERE @rid = :rid';
        db.query(sql, {params:{rid:id}}).then(function(topic){
          console.log(topic[0]);
          // id값에 해당되는 하나의 레코드를 호출했는데 레코드 자체가 배열로 만들어진 객체이므로 배열의 첫번째 요소를 잡아내기위해(객체) topic[0]으로 처리.
          res.render('topic/view', {topics:topics, topic:topic[0]});
        });
      } else {
        res.render('topic/view', {topics:topics, user:req.user});
      }
    });
  });

  return route;
};
