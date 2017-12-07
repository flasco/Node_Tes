'use strict';
var router = require('express').Router();
var querystring = require('querystring');

var AV = require('leanengine');

router.get('/', async function (req, res, next) {
  let word = req.query.name, author = req.query.aut, pid = req.query.pid;
  if (word.length === 0) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
    res.end('Empty word..');
    return;
  }
  let resu = [], nameSet = [],cql;
  if (pid === undefined || pid.length === 0) {
    cql = `select * from Novel where name like '%${word}%' and author like '%${author}%' limit 120 order by plantFormId`;
  } else {
    cql = `select * from Novel where name like '%${word}%' and author like '%${author}%' and plantFormId = ${pid} limit 120 order by plantFormId`;
  }
  let data = await AV.Query.doCloudQuery(cql);
  data = data.results;
  for (let i = 0, k = 0, j = data.length; i < j; i++) {
    let name = data[i].get('name');
    let author = data[i].get('author');
    if (nameSet[`${name}${author}`] !== undefined) {
        resu[nameSet[`${name}${author}`]].source[data[i].get('plantFormId')] = data[i].get('url');
    } else {
      nameSet[`${name}${author}`] = k;
      resu[k] = {
        bookName: name,
        author: data[i].get('author'),
        desc: data[i].get('desc'),
        img: data[i].get('img'),
        plantformId:data[i].get('plantFormId'),
        source: {}
      }
      resu[k++].source[data[i].get('plantFormId')] = data[i].get('url');
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/json;charset=UTF-8' });
  res.end(JSON.stringify(resu));
});

module.exports = router;
