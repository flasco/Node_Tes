var HttpReq = require('../HttpReq');
var cheerio = require('cheerio');
var url = require("url");
var iconv = require('iconv-lite');
var async = require('async');
var AV = require('leanengine');

var Novel = AV.Object.extend('Novel');

var q = async.queue(function(url,callback) {
    fetchXml(url,()=>{
        callback(null);
    });
}, 5);
var p = async.queue(function(url,callback) {
    fetchBook(url,()=>{
        callback(null);
    });
}, 5);

 q.drain=()=>{console.log('fetchXML....finish...')}
 p.drain=()=>{console.log('fetchList....finish...')}

function tes(){
    for(let i = 1;i<5;i++){
        q.push("http://www.biqiuge.com/api/sitemap_"+i+".xml");
    }
}

function fetchXml(urlx,callback){
    HttpReq.crawlPage(urlx,(res)=>{
    res = iconv.decode(Buffer.concat(res),'utf-8');
    var re = new RegExp("<loc>(.*)<","g");
    while((arr = re.exec(res))!= undefined){
         p.push(arr[1]);
    }
    callback();
    })
}

function fetchBook(urlx,callback){
    HttpReq.crawlPage(urlx,(res)=>{
    res = iconv.decode(Buffer.concat(res),'gbk');
    let re = new RegExp("<h1>(.*)<.*\n.*作者.*>(.*)</a>","g");
    while((arr = re.exec(res))!= undefined){
        // console.log(arr[1]);//书名
        // console.log(arr[2]);//作者
        // console.log(urlx);//网址
        let novel = new Novel();
        novel.set('name', arr[1]);
        novel.set('url', urlx);
        novel.set('plantFormId', '5');
        novel.set('author', arr[2]);
        // novel.set('type', '武侠');
        novel.save();
    }
        callback();
    })

}


exports.fetchXml = fetchXml;
exports.fetchBook = fetchBook;
exports.tes = tes;