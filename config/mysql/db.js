module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({ //createConnection()메서드 호출로 데이터베이스 객체를 받아온다.
    host     : 'localhost',
    user     : 'root',
    password : process.env.MySQL_DB,
    database : 'o2'
  });
  conn.connect(); // 데이터베이스에 접속한다.

  return conn;
};
