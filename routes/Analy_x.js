'use strict';
var router = require('express').Router();

var AV = require('leanengine');

// AV.init({
//   appId: 'XvM4C5TKB8AK1XcyC3041OeQ-gzGzoHsz',//process.env.LEANCLOUD_APP_ID,
//   appKey: 'hF492dpV15UMdQt120SE966S',//process.env.LEANCLOUD_APP_KEY,
// });

var Novel = AV.Object.extend('Novel');
// var Novel = Ax.Object.extend('Novel');

router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/json;charset=UTF-8'});
    res.end('你好，黑户。');
    var novel = new Novel();
    novel.set('name', '武林高手异界行');
    novel.set('url', 'http://www.baidu.com');
    novel.set('latestChapter', '第2012章 胖揍逆子');
    novel.set('plantFormId', '2');
    novel.set('author', '呆呆龙');
    novel.set('type', '武侠');
    novel.save().then(function() {
        console.log('save success');
    }, function(error) {
        alert(JSON.stringify(error));
    });

});

module.exports = router;
