// 이 함수는 sum.js 내부에서만 사용가능한 캡슐화 되어진 함수임.
function _sum(a, b){
  return a+b;
}

module.exports = function(a, b){  // 2. module.exports 명령으로 해당 함수를 외부로 보낼 수 있다.
  return _sum(a, b);
};
