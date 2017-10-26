'use strict';
var router = require('express').Router();

var AV = require('leanengine');


var Novel = AV.Object.extend('Novel');

router.get('/', function(req, res, next) {
    
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
