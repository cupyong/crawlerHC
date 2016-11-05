'use strict';
let crawler = require('./common/crawler');
// let crawler = require('crawler');
let jsdom = require('jsdom');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

console.log(__dirname)
mongoose.connect("mongodb://localhost/hc",
    {db: {
       safe: true
    }}
  );
const modelsPath = path.join(__dirname, 'model');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});
mongoose.Promise = require('bluebird');
const Nav = mongoose.model('Nav');
const Content = mongoose.model('Content');

var start=function (url,type,code) {
     var startCrawler =  new crawler({
        jQuery: jsdom,
        maxConnections: 10,
        forceUTF8: true,
        callback: function(err,result,$) {
           if(type==1){
                $('.IndexNav a').each(function(index, a) {
                    let nextUrl = $(a).attr('href')
                    Nav.create({
                        name:$(a).html(),
                        url:nextUrl,
                        level:type
                    },function (err,result) {
                        start(nextUrl,2,result._id.toString())
                    })
                });
            }else{
                $('.hyIndexNav a').each(function(index, a) {
                    let nextUrl = $(a).attr('href')
                    Nav.create({
                        name:$(a).html(),
                        url:nextUrl,
                        level:type,
                        parent_id:code
                    })
                });
            }
        }
    });
    startCrawler.queue(url);
}



var startDetail=function (url,parentId,listUrl) {
   var startCrawler =  new crawler({
        jQuery: jsdom,
        maxConnections: 10,
        forceUTF8: true,
        callback: function(err,result,$) {
            if(err){
                console.log(err,url)
                return;
            }
            var title = $(".dTopBox h1").html();
            if(title){
                var date=$(".dLeft").html()
                var content_date;
                if(date){
                    content_date = new Date(date.replace("年","-").replace("月","-").replace("日&nbsp;"," "))
                }
                var content =$(".dCon").html()
                if(content_date){
                    Content.create({
                        title:title,
                        date:date,
                        content:content,
                        content_date:content_date,
                        parent_id:parentId,
                        url:url
                    })
                }else{
                    Content.create({
                        title:title,
                        date:date,
                        content:content,
                        parent_id:parentId,
                        url:url
                    })
                }
            }else{
                // console.log({
                //     url:url,
                //     parentId:parentId,
                //     listUrl:listUrl
                // })
            }

            // Content.create({
            //     title:title,
            //     date:date,
            //     content:content,
            //     content_date:content_date,
            //     parent_id:parentId
            // })
            // console.log({
            //     title:title,
            //     date:date,
            //     content:content,
            //     content_date:content_date,
            //     parent_id:parentId
            // })

        }
    });
    startCrawler.queue(url);
}
startDetail("http://m.hc360.com/info-cloth/2016/08/101743840483.html")

var startContentUrl2=function (url,parentId) {
    var startCrawler =  new crawler({
        jQuery: jsdom,
        maxConnections: 10,
        forceUTF8: true,
        callback: function(err,result,$) {
            if(err){
                console.log(err,url)
                return;
            }
           console.log(url,$(".NewsList").length)
           $(".NewsList").each(function (index,newlist) {
               if($(newlist).find(".nListRight h3 a").length>0){
                   var title = $(newlist).find(".nListRight h3 a").html()
                   var contentUrl =$(newlist).find(".nListRight h3 a").attr("href")
                   var date = $(newlist).find(".nTime").html()
                   startDetail(contentUrl,parentId,url)
               }else{
                   var title = $(newlist).find(".nListRight h3").html()
                   var contentUrl =$(newlist).find("a").attr("href")
                   startDetail(contentUrl,parentId,url)
               }
           })
           var maxPage= $(".pageBox span").html()
           if(maxPage){
               var page = maxPage.split('/')[0];
               var totalPage=parseInt(maxPage.split('/')[1]) ;
               if(page=="1"){
                   for(let i=1;i<totalPage;i++){
                       startContentUrl2(url.substring(0,url.lastIndexOf('-'))+"-"+(i+1).toString()+".html",parentId)
                   }
               }
           }

           // $(".pageBox span").each(function (index,a) {
           //     if($(a).html()=="下一页"){
           //         if($(a).attr("href").indexOf("http")!=-1){
           //           startContentUrl2($(a).attr("href"),parentId)
           //         }
           //     }
           // })
        }
    });
    startCrawler.queue(url);
}
 // startContentUrl2("http://m.hc360.com/info-cloth/list/001006-014-1.html")

//抓取内容
// var startContentUrl=function () {
//     Nav.find({level:2,name:{$ne:"更多"}},function (err,result) {
//         for(let i=0;i<result.length;i++){
//             startContentUrl2(result[i].url,result[i]._id.toString())
//         }
//     })
// }
// startContentUrl();

//抓取目录
// start("http://m.hc360.com/info/",1)














