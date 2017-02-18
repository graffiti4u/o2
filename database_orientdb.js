var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: process.env.Orient_DB
});

var db = server.use('o2');
/*
db.record.get('#33:0').then(function(record){
  console.log('Loaded record: ', record);
});
*/

// CREATE
/* 1.
var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
  console.log(results); //결과물은 배열을 리턴해 준다.
});
*/
/* 2.
var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
  params:{  //params는 약속되어진 문법이기 때문에 그대로 사용할 것.
    rid: '#33:0'
  }
};
db.query(sql, param).then(function(results){
  console.log(results); //결과물은 배열을 리턴해 준다.
});
*/
// query()함수에는 원하는 sql을 받을 수 있고 또한 추가적으로 가변변수(:rid)를 sql에 작성하여 변수값을 함께 가져올 수도 있다.

// INSERT
/*
var sql = "INSERT INTO topic (title, description) VALUES(:title, :desc)";
db.query(sql, {
  params:  {
    title:'Express',
    desc:'Express is framework for web.'
  }
}).then(function(results){
  console.log(results);
});
*/

// UPDATE
/*
var sql = "UPDATE topic SET title=:title WHERE @rid=:rid";
db.query(sql, {
  params:{title:'Expressjs', rid:'#33:1'}
}).then(function(results){
  console.log(results);
});
// 수정행위를 하면 몇개의 결과가 수정되는지 숫자로 보여준다.
*/

// DELETE
var sql = "DELETE FROM topic WHERE @rid=:rid";
db.query(sql, {
  params:{rid:'#34:0'}
}).then(function(results){
  console.log(results);
});
