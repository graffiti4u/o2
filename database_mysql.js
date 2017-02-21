var mysql = require('mysql');
var conn = mysql.createConnection({ //createConnection()메서드 호출로 데이터베이스 객체를 받아온다.
  host     : 'localhost',
  user     : 'root',
  password : process.env.MySQL_DB,
  database : 'o2'
});

conn.connect(); // 데이터베이스에 접속한다.

var sql = 'SELECT * FROM topic';
conn.query(sql, function(err, rows, fields){  // 데이터베이스에 쿼리를 날린다. 결과는 rows에 배열로 받아온다.
  if(err){
    console.log(err);
  } else {
    console.log('rows', rows);  // rows는 배열이다
    console.log('fields', fields);  // fields는 배열이다.
  }
});

conn.end(); // 서버접속을 끊는다
