var mysql = require('mysql');
var conn = mysql.createConnection({ //createConnection()메서드 호출로 데이터베이스 객체를 받아온다.
  host     : 'localhost',
  user     : 'root',
  password : process.env.MySQL_DB,
  database : 'o2'
});

conn.connect(); // 데이터베이스에 접속한다.

// 1. READ
/*
var sql = 'SELECT * FROM topic';
conn.query(sql, function(err, rows, fields){  // 데이터베이스에 쿼리를 날린다. 결과는 rows에 배열로 받아온다.
  if(err){
    console.log(err);
  } else {
    for(var i=0; i<rows.length; i++){
      console.log(rows[i].author);
    }
  }
});
*/
// 2. INSERT
var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graffiti'];
 conn.query(sql, params, function(err, rows, fields){ //쿼리를 실행할 때 sql에서 가변변수 ?를 만들고 실제 데이터는 params 배열에 넣은 후 query의 두번째 인자로 배열변수를 넣어준다.
   if(err){
     console.log(err);
   } else {
     console.log(rows.insertId);
   }
 });
conn.end(); // 서버접속을 끊는다
