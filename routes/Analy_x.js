<<<<<<< HEAD
'use strict';
var router = require('express').Router();

var HttpReq = require('../HttpReq');

router.get('/', function(req, res, next) {
    let param =req.query;
    res.writeHead(200, {'Content-Type': 'text/json;charset=UTF-8'});
    if(param.action==='1'){
        HttpReq.getChapterList(param.url,(ret)=>{
            res.end(JSON.stringify(ret));
        });
    }else if(param.action==='2'){
        HttpReq.getChapterDetail(param.url,(ret)=>{
            res.end(JSON.stringify(ret));
        });
    }else{
        res.end('Error');
    }

});

module.exports = router;
=======
'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var HttpReq = require('../HttpReq');

router.get('/', function(req, res, next) {
    let param =req.query;
    res.writeHead(200, {'Content-Type': 'text/json;charset=UTF-8'});
    if(param.action==='1'){
        HttpReq.getChapterList(param.url,(ret)=>{
            res.end(JSON.stringify(ret));
        });
    }else if(param.action==='2'){
        HttpReq.getChapterDetail(param.url,(ret)=>{
            res.end(JSON.stringify(ret));
        });
    }else{
        res.end('Error');
    }

});

module.exports = router;
>>>>>>> b6b709f8a6557ae2c4135b654efefc9b8d34ece8
