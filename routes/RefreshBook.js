'use strict';
var router = require('express').Router();
var httpReq = require('../HttpReq');


router.get('/', function (req, res, next) {
    let param = req.query;
    res.writeHead(200, {
        'Content-Type': 'text/json;charset=UTF-8'
    });

    let lis = JSON.parse(param.p);
    
    httpReq.refreshList(lis,(RefList)=>{
        res.end(JSON.stringify(RefList));
    });
   
});


module.exports = router;