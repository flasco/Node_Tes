var AV = require('leanengine');
var httpReq = require('./HttpReq');
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request) {
  return 'Hello world!';
});

AV.Cloud.define('serverStart', function (request) {
  start(17 * 60);
});

function start(tim) {
  console.log(`服务器将持续运行- ${tim} minutes`);
  httpReq.crawlPage(`http://testdb.leanapp.cn/`, () => { });
  tim -= 20;
  if (tim > 0) {
    setTimeout(function () {
      start(tim);
    }, 1200000);
  }
}