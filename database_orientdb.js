var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: process.env.Orient_DB
}); //OrientDb()함수는 서버에 설치되어진 orientDB에 접속할 수 있는 설정을 해 줌으로써 서버 접속을 가능하게 한다.

var db = server.use('o2');  // 데이터베이스 o2를 이용하겠다고 설정. db변수를 통해서 o2 데이터베이스를 제어할 수 있다.

db.record.get('#33:0')  // 특정 레코드를 서버로 부터 얻어오는 방법.
.then(function(record){
  console.log('Loaded record: ', record);
});
