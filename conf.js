let sites = [{
  title: '顶点文学',
  wheSort: false,
  charset: 'gbk',
  latestChapterInfo:'content',
  url: 'http://www.x23us.com',
  latestChapterSelector: `meta[property='og:novel:latest_chapter_name']`,
  chapterListSelector: '#at td a',
  chapterDetail: {
    titleSelector: '#amain h1',
    contentSelector: '#contents',
    prevSelector: '#footlink a',
    nextSelector: '#footlink a,2',
  },
  novelList: {
    selector: '#content table tr',
    nextSelector: '.next',
    prevSelector: '.prev',
  }
}, {
  title: '笔趣阁',
  wheSort: false,
  charset: 'UTF-8',
  latestChapterInfo:'content',
  url: 'http://www.xs.la/',
  latestChapterSelector: `meta[property='og:novel:latest_chapter_name']`,
  chapterListSelector: '#list dd a',
  chapterDetail: {
    titleSelector: '.bookname h1',
    contentSelector: '#content',
    prevSelector: '#pager_prev',
    nextSelector: '#pager_next',
  },
}, {
  title: '看书中',
  wheSort: false,
  charset: 'gbk',
  url: 'http://www.kanshuzhong.com/',
  latestChapterInfo:'content',
  latestChapterSelector: `meta[property='og:novel:latest_chapter_name']`,
  chapterListSelector: '.bookcontent dd a',
  chapterDetail: {
    titleSelector: '.ctitle',
    contentSelector: '.textcontent',
    prevSelector: '.readlink a',
    nextSelector: '.readlink a,4',
  }
}, {
  title: '起点',
  wheSort: false,
  charset: 'UTF-8',
  url: 'http://read.qidian.com',
  latestChapterSelector: `.update .detail .cf a`,
  latestChapterInfo:'title',
  chapterListSelector: '.volume-wrap .volume li a',
  novelRankSelector: '.book-text tbody tr'
}];


function getXMLConf() {
  let site_ = {};
  site_.getX = (host) => {
    let index = ((host + '').indexOf('23us') > 0) && 0
      || ((host + '').indexOf('xs.la') > 0) && 1
      || ((host + '').indexOf('kanshuzhong') > 0) && 2
      || ((host + '').indexOf('qidian') > 0) && 3
      || -1;
    if (index === -1) {
      console.log('err');
    } else {
      return sites[index];
    }
  }
  return site_;
}

module.exports = getXMLConf();
