var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var url = require('url');
var axios = require('axios');

var conf = require('./conf');

async function crawlPage(urlx, callback) {
  const { err, data } = await axios.get(urlx, {
    responseType: 'arraybuffer',//不对抓取的数据进行编码解析
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
      'Connection': 'keep-alive',
      'Referer': 'https://www.baidu.com',
    }
  })
  return err ? '-1' : data;
}

function NovelChaper(title, url) {
  this.title = title;
  this.url = url.replace(/(.*)(\/.*\/){2}(.*)/, '$1$2$3');
}

async function getChapterList(urlx, callback) {
  let res = await crawlPage(urlx)
  if (res === '-1') {
    return '-1';
  }
  const host = url.parse(urlx).host;
  res = iconv.decode(res, conf.getX(host).charset)
  const $ = cheerio.load(res, {
    decodeEntities: false
  });
  let as = $(conf.getX(host).chapterListSelector);
  let arr = [], tit = new Set(), i = 0, j = 0;
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
  return arr;
}

async function getChapterDetail(urlx, callback) {
  let res = await crawlPage(urlx);
  if (res === '-1') {
    return '-1';
  }
  const host = url.parse(urlx).host;
  res = iconv.decode(res, conf.getX(host).charset);
  res = res.replace(/&nbsp;/g, '').replace(/<br \/>/g, '${line}').replace(/<br\/>/g, '${line}');
  const $ = cheerio.load(res, { decodeEntities: false });
  let asTit = $(conf.getX(host).chapterDetail.titleSelector);
  let asCon = $(conf.getX(host).chapterDetail.contentSelector).text();
  let arr = {
    title: asTit[0].children[0].data,
    content: asCon.replace(/\${line}/g, '\n').replace(/[ 　]+/g, '').replace(/\n+/g, '\n')
  };
  return arr;
}

function bk(t, n, l, a) {
  this.type = t;
  this.name = n;
  this.latestChapter = l;
  this.author = a;
}

async function RnkList(x) {
  let urlx = `http://r.qidian.com/yuepiao?style=2&page=${x}`;
  let RankList = [];
  let res = await crawlPage(urlx);
  if (res === '-1') {
    return '-1';
  }

  const host = url.parse(urlx).host;
  res = iconv.decode(res, conf.getX(host).charset);
  const $ = cheerio.load(res, {
    decodeEntities: false
  });
  let ass = $(conf.getX(host).novelRankSelector);
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
    RankList.push(new bk(type, name, latestChapter, author));
  }

  return RankList;
}



exports.getChapterList = getChapterList;
exports.crawlPage = crawlPage;
exports.getChapterDetail = getChapterDetail;
exports.RnkList = RnkList;
