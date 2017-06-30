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
