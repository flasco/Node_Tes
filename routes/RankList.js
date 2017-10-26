'use strict';
var router = require('express').Router();
var httpReq = require('../HttpReq');

router.get('/', function (req, res, next) {
    let param = req.query;
    res.writeHead(200, {
        'Content-Type': 'text/json;charset=UTF-8'
    });
    httpReq.RnkList(param.p,(list)=>{
        res.end(JSON.stringify(list));
    })

   
});



module.exports = router;