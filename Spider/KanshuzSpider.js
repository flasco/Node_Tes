var HttpReq = require('../HttpReq');
var cheerio = require('cheerio');
var url = require("url");
var iconv = require('iconv-lite');
var async = require('async');

var conf = require('../conf');

var q = async.queue(function(url,callback) {
    fetchList(url,()=>{
        callback(null);
    });
}, 5);

 q.drain=()=>{console.log('finish...')}

function tes(){
    for(let i = 0;i<26;i++){
        q.push("http://www.kanshuzhong.com/map/"+String.fromCharCode(65+i)+"/1/");
    }
}

function fetchList(urlx,callback){
    HttpReq.crawlPage(urlx,(res)=>{
        let host = url.parse(urlx).host;
        res = iconv.decode(Buffer.concat(res), conf.getX(host,'charset'));
        let $ = cheerio.load(res ,{decodeEntities: false});
        let ass = $(conf.getX(host,'novel-list-selector'));
        let novelList = {};
        let $2,asn;
        //   console.time("测试代码速度");
        for(let i = 1,size=ass.length-1 ;i<size ; i++){
            $2 = cheerio.load(ass[i] ,{decodeEntities: false})
            asn = $2('td');
            novelList[i-1] = new Object();
            novelList[i-1].type = asn[0].children[0].children[0].children[0].data;
            novelList[i-1].name = asn[1].children[0].children[0].children[0].data;
            novelList[i-1].latestChapter = asn[2].children[0].children[0].children[0].data;
            novelList[i-1].author = asn[3].children[0].children[0].children[0].data;
        }
        let nextPageSelector = $(conf.getX(host,"novel-list-next-selector"));
        if( nextPageSelector.length != 0){
            q.push(nextPageSelector[0].attribs.href);
        }
        callback();

    })

}

exports.fetchList = fetchList;
exports.tes = tes;