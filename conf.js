var fs = require('fs');
var select = require("xpath.js"),
    dom = require("xmldom").DOMParser;

function getXMLConf() {
        let site_ = new Map();
        let data = fs.readFileSync("./conf/Spider-Rule.xml", "utf-8");
        let doc = new dom().parseFromString(data);
        data = '';
        let nodes = select(doc, "site");
        doc = '';
        let j = 0;
        while(j<nodes.length){
            let node_child = nodes[j].childNodes;
            let bookSelector = new Map();
            let i = 1;
            while(i<node_child.length){
               bookSelector.set(node_child[i].nodeName,node_child[i].lastChild.data) ;
               i+=2;
            }
            site_.set(j+1,bookSelector);
            j++;
        }
        // console.dir(site_);
        site_.getX=(host,xmlselect)=>{
            let siteId = 0;
            if((host+'').indexOf('23us')>0){
                siteId = 1;
            }else if((host+'').indexOf('qidian')>0){
                 siteId = 2;
            }else if((host+'').indexOf('xs.la')>0){
                 siteId = 3;
            }else if((host+'').indexOf('luoqiu')>0){
                 siteId = 4;
            }else if((host+'').indexOf('biqiuge.com')>0){
                 siteId = 5;
            }else if((host+'').indexOf('kanshuzhong')>0){
                 siteId = 6;
            }
            if(siteId === 0) throw new DOMException;

            return site_.get(siteId).get(xmlselect);
        };
        return site_;
}

module.exports = getXMLConf();