var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var url = require("url");
var path = require('path');

var conf = require('./conf');


function crawlPage(urlx,callback = null) {
    let u = url.parse(urlx);
    let option={
        host: u.host.replace(/(.*):\d+/,'$1'),
        path: u.path,
        Method:'get',
        port:u.port,
        headers:{
           'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
           'Referer':'https://www.baidu.com/s?wd=%213',
           'Keep-Alive': 300,
           'Accept':'*/*',
           'Accept-Language':'zh-CN,zh;q=0.8',
           'Connection':'keep-alive',
    }
    }
    http.get(option, function (res) {
        let chunks = [];
        res.writer
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end',()=>{

            callback (chunks);
        })
    }).on('error', function (err) {
        console.log(err);
    });
}

function novelChaper(title,url){
    this.title = title;
    this.url = url;
}

function getChapterList(urlx,callback){
    crawlPage(urlx,(res)=>{
        let host = url.parse(urlx).host;
        res = iconv.decode(Buffer.concat(res), conf.getX(host,'charset'))
        var $ = cheerio.load(res ,{decodeEntities: false});
        var as = $(conf.getX(host,'chapter-list-selector'));
        var arr = new Array();
        var tit = new Set();
        let i = 0,j=0; 
        // console.time("测试代码速度");
        while(i<as.length){
            let tex = as[i].children[0].data;
            if(!tit.has(tex)){
                arr[j++] = new novelChaper(tex,urlx+as[i].attribs.href);
                tit.add(tex);
            }
            i++;
        }
        arr.sort(function(a,b){
            let o1U=a.url;
            let o2U=b.url;
            let o1Index = o1U.substring(o1U.lastIndexOf('/')+1,o1U.lastIndexOf('.'));
            let o2Index = o2U.substring(o2U.lastIndexOf('/')+1,o2U.lastIndexOf('.'));
            return o1Index-o2Index;
        });
        // console.timeEnd("测试代码速度");
        callback(arr);
    })
}

function getChapterDetail(urlx,callback){
    crawlPage(urlx,(res)=>{
        let host = url.parse(urlx).host;
        res = iconv.decode(Buffer.concat(res), conf.getX(host,'charset'))
        res = res.replace(/&nbsp;/g,"").replace(/\<br \/\>/g, "${line}").replace(/\<br\/\>/g, "${line}");
        var $ = cheerio.load(res ,{decodeEntities: false});

        var asTit = $(conf.getX(host,'chapter-detail-title-selector'));
        var asCon = $(conf.getX(host,'chapter-detail-content-selector')).text();
        var prevUrl = $(conf.getX(host,'chapter-detail-prev-selector'));
        var nextUrl = $(conf.getX(host,'chapter-detail-next-selector'));

        var arr = new Object();
        arr.title = asTit[0].children[0].data;
        arr.content = asCon.replace(/\${line}/g,"\n").replace(/[ 　]+/g,"").replace(/\n+/g,"\n");

        
        let i = 0;
        while(i<prevUrl.length){
            if(prevUrl[i].children[0].data.indexOf('上')>=0){
                if(path.basename(prevUrl[i].attribs.href)!='.'){
                    arr.prev = path.dirname(urlx)+"/"+path.basename(prevUrl[i].attribs.href);
                }
                else {
                    arr.prev = path.dirname(urlx)+"/"+prevUrl[i].attribs.href;
                }
                break;
            }
            i++;
        }
        i = 0;
        
        while(i<nextUrl.length){
            if(nextUrl[i].children[0].data.indexOf('下')>=0){
                if(path.basename(nextUrl[i].attribs.href)!='.'){
                    arr.next = path.dirname(urlx)+"/"+path.basename(nextUrl[i].attribs.href);
                }
                else {
                    arr.next = path.dirname(urlx)+"/"+nextUrl[i].attribs.href;
                }
                break;
            }
            i++;
        }
        callback(arr);
    });
}



exports.getChapterList=getChapterList;
exports.crawlPage=crawlPage;
exports.getChapterDetail = getChapterDetail;
