<<<<<<< HEAD
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var url = require('url');
var path = require('path');
var request = require('request');

var conf = require('./conf');

function crawlPage(urlx, callback) {
    let u = url.parse(urlx);
    let option = {
        url: urlx,
        encoding: null,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            'Cache-Control': 'max-age=0',
            'Referer': 'https://www.baidu.com',
        }
    }
    request(option, (err, res, bod) => {
        if (!err && res.statusCode == 200) {
            // console.log(bod);
            callback(bod);
        } else {
            callback('-1');
        }
    });
}

function NovelChaper(title, url) {
    this.title = title;
    this.url = url.replace(/(.*)(\/.*\/){2}(.*)/, '$1$2$3');
}

function getChapterList(urlx, callback) {
    crawlPage(urlx, (res) => {
        if (res === '-1') {
            callback('-1');
            return;
        }
        let host = url.parse(urlx).host;
        res = iconv.decode(res, conf.getX(host, 'charset'))
        var $ = cheerio.load(res, {
            decodeEntities: false
        });
        var as = $(conf.getX(host, 'chapter-list-selector'));
        var arr = [];
        var tit = new Set();
        let i = 0;
        let j = 0;
        // console.time("测试代码速度");
        while (i < as.length) {
            let tex = as[i].children[0].data;
            if (!tit.has(tex)) {
                arr[j++] = new NovelChaper(tex, urlx + as[i].attribs.href);
                tit.add(tex);
            }
            i++;
        }
        arr.sort(function (a, b) {
            let o1U = a.url;
            let o2U = b.url;
            let o1Index = o1U.substring(o1U.lastIndexOf('/') + 1, o1U.lastIndexOf('.'));
            let o2Index = o2U.substring(o2U.lastIndexOf('/') + 1, o2U.lastIndexOf('.'));
            return o1Index - o2Index;
        });
        // console.timeEnd("测试代码速度");
        callback(arr);
    })
}

function getChapterDetail(urlx, callback) {
    crawlPage(urlx, (res) => {
        if (res === '-1') {
            callback('-1');
            return;
        }
        let host = url.parse(urlx).host;
        res = iconv.decode(res, conf.getX(host, 'charset'));
        res = res.replace(/&nbsp;/g, '').replace(/<br \/>/g, '${line}').replace(/<br\/>/g, '${line}');
        var $ = cheerio.load(res, {
            decodeEntities: false
        });

        var asTit = $(conf.getX(host, 'chapter-detail-title-selector'));
        var asCon = $(conf.getX(host, 'chapter-detail-content-selector')).text();
        var prevUrl = $(conf.getX(host, 'chapter-detail-prev-selector'));
        var nextUrl = $(conf.getX(host, 'chapter-detail-next-selector'));

        var arr = {};
        arr.title = asTit[0].children[0].data;
        arr.content = asCon.replace(/\${line}/g, '\n').replace(/[ 　]+/g, '').replace(/\n+/g, '\n');

        let i = 0;
        while (i < prevUrl.length) {
            if (prevUrl[i].children[0].data.indexOf('上') >= 0) {
                if (path.basename(prevUrl[i].attribs.href) !== '.') {
                    arr.prev = path.dirname(urlx) + '/' + path.basename(prevUrl[i].attribs.href);
                } else {
                    arr.prev = path.dirname(urlx) + '/' + prevUrl[i].attribs.href;
                }
                break;
            }
            i++;
        }
        i = 0;

        while (i < nextUrl.length) {
            if (nextUrl[i].children[0].data.indexOf('下') >= 0) {
                if (path.basename(nextUrl[i].attribs.href) !== '.') {
                    arr.next = path.dirname(urlx) + '/' + path.basename(nextUrl[i].attribs.href);
                } else {
                    arr.next = path.dirname(urlx) + '/' + nextUrl[i].attribs.href;
                }
                break;
            }
            i++;
        }
        callback(arr);
    });
}


function refreshList(a,callback){
    let leng = a.length-1, RefList = [];
    refreshChapterLists(a,RefList,(i)=>{
        // console.log('当前第'+i+'本')
        if(i === leng){
            // console.log(RefList);
            callback(RefList);
        }
    })
}

function refreshChapterLists(ChapterList,RefList,callback) {
    for (let i = 0, j = ChapterList.length; i < j; i++) { 
        let bkurl = ChapterList[i].url;
        let bkrec = ChapterList[i].latestChapter;
        getChapterList(bkurl, (arr) => {
            arr = arr.reverse();
            let tit = arr[0].title.length > 25 ? arr[0].title.substr(0, 18) + '...' : arr[0].title;
            RefList[i] = tit !== bkrec ? arr : '-1' ;
            callback(i);
        })
    }
}

function bk(t,n,l,a){
    this.type = t;
    this.name = n;
    this.latestChapter = l;
    this.author = a;
}

function RnkList(x, callback) {
    let urlx = `http://r.qidian.com/yuepiao?style=2&page=${x}`;
    let RankList = [];
    crawlPage(urlx, (res) => {
        if (res !== '-1') {
            let host = url.parse(urlx).host;
            res = iconv.decode(res, conf.getX(host, 'charset'));
            let $ = cheerio.load(res, {
                decodeEntities: false
            });
            let ass = $(conf.getX(host, 'novel-Rank-selector'));
            let $2, asn;
            for (let i = 0, size = ass.length; i < size; i++) {
                $2 = cheerio.load(ass[i], {
                    decodeEntities: false
                })
                asn = $2('td');
                if (asn.length < 2) continue;
                let type = asn[1].children[0].children[1].data;
                let name = asn[2].children[0].children[0].data;
                let latestChapter = asn[3].children[0].children[0].data;
                let author = asn[5].children[0].children[0].data;
                RankList.push(new bk(type,name,latestChapter,author));
            }
        }
        callback(RankList);
    })
}



exports.getChapterList = getChapterList;
exports.crawlPage = crawlPage;
exports.getChapterDetail = getChapterDetail;
exports.refreshList = refreshList;
exports.RnkList = RnkList;
=======
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var url = require('url');
var path = require('path');
var request = require('request');

var conf = require('./conf');

function crawlPage (urlx, callback) {
    let u = url.parse(urlx);
    let option = {
        url:urlx,
        encoding : null,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            'Cache-Control':'max-age=0',
            'Referer': 'https://www.baidu.com',
    }
    }
    request(option, (err,res,bod)=>{
        if (!err && res.statusCode == 200) {
            // console.log(bod);
             callback(bod);
        }else{
             callback('-1');
        }
    });
}

function NovelChaper (title, url) {
    this.title = title;
    this.url = url;
}

function getChapterList (urlx, callback) {
    crawlPage(urlx, (res) => {
        if (res === '-1') {
            callback('-1');
            return;
        }
        let host = url.parse(urlx).host;
        res = iconv.decode(res, conf.getX(host, 'charset'));
        var $ = cheerio.load(res, { decodeEntities: false });
        var as = $(conf.getX(host, 'chapter-list-selector'));
        var arr = [];
        var tit = new Set();
        let i = 0;
        let j = 0;
        // console.time("测试代码速度");
        while (i < as.length) {
            let tex = as[i].children[0].data;
            if (!tit.has(tex)) {
                arr[j++] = new NovelChaper(tex, urlx + as[i].attribs.href);
                tit.add(tex);
            }
            i++;
        }
        arr.sort(function (a, b) {
            let o1U = a.url;
            let o2U = b.url;
            let o1Index = o1U.substring(o1U.lastIndexOf('/') + 1, o1U.lastIndexOf('.'));
            let o2Index = o2U.substring(o2U.lastIndexOf('/') + 1, o2U.lastIndexOf('.'));
            return o1Index - o2Index;
        });
        // console.timeEnd("测试代码速度");
        callback(arr);
    })
}

function getChapterDetail (urlx, callback) {
    crawlPage(urlx, (res) => {
        if (res === '-1') {
            callback('-1');
            return;
        }
        let host = url.parse(urlx).host;
        res = iconv.decode(res, conf.getX(host, 'charset'));
        res = res.replace(/&nbsp;/g, '').replace(/<br \/>/g, '${line}').replace(/<br\/>/g, '${line}');
        var $ = cheerio.load(res, { decodeEntities: false });

        var asTit = $(conf.getX(host, 'chapter-detail-title-selector'));
        var asCon = $(conf.getX(host, 'chapter-detail-content-selector')).text();
        var prevUrl = $(conf.getX(host, 'chapter-detail-prev-selector'));
        var nextUrl = $(conf.getX(host, 'chapter-detail-next-selector'));

        var arr = {};
        arr.title = asTit[0].children[0].data;
        arr.content = asCon.replace(/\${line}/g, '\n').replace(/[ 　]+/g, '').replace(/\n+/g, '\n');

        let i = 0;
        while (i < prevUrl.length) {
            if (prevUrl[i].children[0].data.indexOf('上') >= 0) {
                if (path.basename(prevUrl[i].attribs.href) !== '.') {
                    arr.prev = path.dirname(urlx) + '/' + path.basename(prevUrl[i].attribs.href);
                } else {
                    arr.prev = path.dirname(urlx) + '/' + prevUrl[i].attribs.href;
                }
                break;
            }
            i++;
        }
        i = 0;

        while (i < nextUrl.length) {
            if (nextUrl[i].children[0].data.indexOf('下') >= 0) {
                if (path.basename(nextUrl[i].attribs.href) !== '.') {
                    arr.next = path.dirname(urlx) + '/' + path.basename(nextUrl[i].attribs.href);
                } else {
                    arr.next = path.dirname(urlx) + '/' + nextUrl[i].attribs.href;
                }
                break;
            }
            i++;
        }
        callback(arr);
    });
}

exports.getChapterList = getChapterList;
exports.crawlPage = crawlPage;
exports.getChapterDetail = getChapterDetail;
>>>>>>> b6b709f8a6557ae2c4135b654efefc9b8d34ece8
