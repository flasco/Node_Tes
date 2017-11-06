'use strict';
var router = require('express').Router();
var httpReq = require('../HttpReq');
var Tm = 0;
var startTime ;
router.get('/', function (req, res, next) {
    let param = req.query;
    res.writeHead(200, {
        'Content-Type': 'text/json;charset=UTF-8'
    });
    if (param.h !== '') {
        if(Tm !== 1){
            Tm = 1;
            startTime = new Date().toLocaleTimeString();
            start(param.h * 60);
            res.end(`server will run ${ param.h } hour`);
        }else{
            res.end(`server run from ${startTime}`);
        }
        
    } else {
        res.end('Error');
    }
});

function start(tim) {

    console.log(`服务器将持续运行- ${tim} minutes`);
    httpReq.crawlPage('http://testdb.leanapp.cn/', () => {});
    tim -= 20;
    if (tim > 0) {
        setTimeout(function () {
            start(tim);
        }, 1200000);
    }else{
        Tm = 0;
    }
}


module.exports = router;