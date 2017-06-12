'use strict';
var router = require('express').Router();


// 查询 Todo 列表
router.get('/', function(req, res, next) {

    res.render('todos', {
      title: 'TODO 列表',
      todos: "results"

  }, function(err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('todos', {
        title: 'Error',
        todos: '101'
      });
    } else {
      next(err);
    }
  }).catch(next);
});

router.get('/Analx', function(req, res, next) {
    response.writeHead(200, {'Content-Type': 'text/json;charset=UTF-8'});
    response.end('你好，黑户。');
});

module.exports = router;
