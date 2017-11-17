const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const url = require('url');
const axios = require('axios');

const conf = require('./conf');

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
  let res = await crawlPage(urlx);
  if (res === '-1') { return '-1'; }
  const host = url.parse(urlx).host;
  const cfg = conf.getX(host);
  res = iconv.decode(res, conf.getX(host).charset)
  const $ = cheerio.load(res, { decodeEntities: false });
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
  cfg.wheSort && arr.sort(function (a, b) {
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
  const cfg = conf.getX(host);
  res = iconv.decode(res, cfg.charset);
  res = res.replace(/&nbsp;/g, '').replace(/<br \/>/g, '${line}').replace(/<br\/>/g, '${line}');
  const $ = cheerio.load(res, { decodeEntities: false });
  let asTit = $(cfg.chapterDetail.titleSelector);
  let asCon = $(cfg.chapterDetail.contentSelector).text();
  let arr = {
    title: asTit[0].children[0].data,
    content: asCon.replace(/\${line}/g, '\n').replace(/[ 　]+/g, '').replace(/\n+/g, '\n')
  };
  return arr;
}

async function RnkList(x) {
  let urlx = `http://r.qidian.com/yuepiao?style=2&page=${x}`;
  let RankList = [];
  let res = await crawlPage(urlx);
  if (res === '-1') {
    return '-1';
  }
  const host = url.parse(urlx).host;
  const cfg = conf.getX(host);
  res = iconv.decode(res, cfg.charset);
  const $ = cheerio.load(res, { decodeEntities: false });
  const ass = $(cfg.novelRankSelector);
  let $2, asn;
  for (let i = 0, size = ass.length; i < size; i++) {
    $2 = cheerio.load(ass[i], { decodeEntities: false })
    asn = $2('td');
    if (asn.length < 2) continue;
    RankList.push({
      type: asn[1].children[0].children[1].data,
      name: asn[2].children[0].children[0].data,
      latestChapter: asn[3].children[0].children[0].data,
      author: asn[5].children[0].children[0].data,
    });
  }
  return RankList;
}



exports.getChapterList = getChapterList;
exports.crawlPage = crawlPage;
exports.getChapterDetail = getChapterDetail;
exports.RnkList = RnkList;
