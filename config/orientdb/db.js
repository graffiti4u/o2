module.exports = function(){
  // 사용자 관리를 데이터베이스로 관리하기 위해 orientdb 설정.
  var OrientDB = require('orientjs');

  var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: process.env.Orient_DB // 비밀번호 같은경우 설정파일을 따로 만들어 로딩하거나 환경변수로 처리해서 보안에 유의해야 한다.
  });

  var db = server.use('o2');  // DB를 지정해 준다.

  return db;
};
