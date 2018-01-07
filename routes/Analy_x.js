'use strict';
var router = require('express').Router();

var HttpReq = require('../HttpReq');

router.get('/', async function (req, res, next) {
  let param = req.query;
  res.writeHead(200, { 'Content-Type': 'text/json;charset=UTF-8' });
  const ret = (param.action === '1') && await HttpReq.getChapterList(param.url)
    || param.action === '2' && await HttpReq.getChapterDetail(param.url) 
    || param.action === '3' && await HttpReq.getLatestChapter(param.url)
  ret ? res.end(JSON.stringify(ret)) : res.end('Error');
});

module.exports = router;
