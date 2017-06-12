'use strict';
var router = require('express').Router();


router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/json;charset=UTF-8'});
    res.end('你好，黑户。');
});

module.exports = router;
