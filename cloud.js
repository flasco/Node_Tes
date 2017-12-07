var AV = require('leanengine');
var httpReq = require('./HttpReq');
var x = require('./config');
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request) {
  return 'Hello world!';
});

AV.Cloud.define('serverStart', function (request) {
  start(18 * 60);
  return x.jiedian === 0 ? '华东节点 - flasco' : '华北节点 - testdb';
});

function start(tim) {
  console.log(`服务器将持续运行- ${tim} minutes`);
  httpReq.crawlPage(`http://${x.jiedian === 0 ? 'flasco' : 'testdb'}.leanapp.cn/`, () => { });
  tim -= 20;
  if (tim > 0) {
    setTimeout(function () {
      start(tim);
    }, 1200000);
  }
}