'use strict';
var router = require('express').Router();
var querystring = require('querystring');

var AV = require('leanengine');

var Novel = AV.Object.extend('Novel');

router.get('/', function(req, res, next) {
    let word = req.query.name;
    if(word.length==0) {
        res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
        res.end('Empty word..'); 
        return ;
    }
    var queryx = new AV.Query('Novel');
    queryx.contains('name',word);
    queryx.find().then(function (todo) {
      let i = 0;
      let resu = [];
      if(todo.length>0){
        while(i<todo.length){
            resu[i] = new Object();
            resu[i].name = todo[i].get('name');
            resu[i].url = todo[i].get('url');
            resu[i].author = todo[i].get('author');
            resu[i].plantFormId = todo[i].get('plantFormId');
            i++;
        }
      }else{
          resu = 'error...';
      }
      res.writeHead(200, {'Content-Type': 'text/json;charset=UTF-8'});
      res.end(JSON.stringify(resu)); 
    }, function (error) {
      // 异常处理
    })

});

module.exports = router;
