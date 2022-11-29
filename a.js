
const http = require('http')
const fs = require('fs')
const path = require('path')
const getData = require('./spider/search.js')
const {TYPE_MAP,STATE_MAP,SORT_MAP,labels} = require('./spider/htmlStore/labelPage/labelsMap')

const baseUrl = "http://www.mangabz.com/"
const labelBase = 'manga-list'

// 请求首页数据
exports.getIndexList = async function(){
    // 实时爬取首页数据（总会有一两张爬不出来）
    // return await new Promise((resolve,reject)=> {
    //     http.get(
    //         baseUrl,
    //         function(res){
    //             let html = ''
    //             res.on('data',function(res){
    //                 html+=res
    //             })
    //             res.on('end',async function(res){
    //                 let indexPageList = await getData.getIndexPageList(html)
    //                 resolve(indexPageList)
    //             })
    //         }
    //     )
    // }) 

    // 固定数据
    return await new Promise((resolve,reject)=> {
        fs.readFile(path.resolve(__dirname,'./htmlStore/indexPage/IndexPagedata.json'),'utf8',(err,data)=> {
            if(err) console.error(err);
            resolve(data)
        })
    })
}

// 请求详情页数据(传入漫画的唯一标识)
exports.getDetailPageList = async function(comicId){
    return await new Promise((resolve,reject)=> {
        http.get(
            baseUrl+comicId.slice(1),
            function(res){
                let html = ''
                res.on('data',function(res){
                    html+=res
                })
                res.on('end',async function(res){
                    let detailPageList = await getData.getDetailPageList(html,comicId.replace(/\/*\//g,''))
                    resolve(detailPageList)
                })
            }
        )
    })   
    // return await new Promise((resolve,reject)=> {
    //     fs.readFile(path.resolve(__dirname,'./htmlStore/detailPage/detailPage.json'),'utf8',(err,data)=> {
    //         if(err) console.error(err);
    //         resolve(data)
    //     })
    // })
}

// 请求漫画页（传入漫画的唯一标识comidId,章节的唯一标识href以及页数page）
exports.getComic = async function(comicId,chapterId,page){
    return await new Promise((resolve,reject)=> {
        http.get(
            baseUrl+chapterId.slice(1),
            function (res) {
                let html = ''
                res.on('data', function (res) {
                    html += res
                })
                res.on('end', async function (res) {
                    let comicBookData = await getData.getComicBookList(html,baseUrl+chapterId.slice(1),comicId.replace(/\/*\//g,''),chapterId.replace(/\/*\//g,''),page)
                    resolve(comicBookData)
                })
            }
        )
    })
    
}
// getComic("/266bz/","/m19216/",9).then(res=> {
//     console.log(res);
// })


// 请求搜索页（传入搜索内容，以及搜索页数）
exports.getSearchList = async function(searchKey,page){
    let param = `search?title=${searchKey}&page=${page}`
    return await new Promise((resolve,reject)=> {
        http.get(
            baseUrl+param,
            function(res) {
                let html = ''
                res.on('data',function(res) {
                    html+=res
                })
                res.on('end', async function(res) {
                    let searchPageList = await getData.getSearchPageList(html)
                    resolve(searchPageList)
                })
            }
        )
    })
}

// 请求标签分类页（传入题材，漫画状态，排序方式，页数）
exports.getLabelList = async function(type='全部',state='全部',sort='人气',page=1) {
    let url = `${baseUrl}${labelBase}-${TYPE_MAP.get(type)}-${STATE_MAP.get(state)}-${SORT_MAP.get(sort)}-p${page}/`
    return new Promise((resolve,reject)=> {
        http.get(
            url,
            function(res) {
                let html = ''
                res.on('data',function(res) {
                    html+=res
                })
                res.on('end', async function(res) {
                    let searchPageList = await getData.getLabelPageList(html)
                    resolve(searchPageList)
                })
            }
        )
    })
}

// 请求标签
exports.getLabels = function() {
    return labels
}


// 爬取所有封面脚本


// let p1 = new Promise((resolve,reject)=>{
//     setTimeout(()=> {
//         resolve(1)
//     },1000)
// })
// let p2 = new Promise((resolve,reject)=>{
//     setTimeout(()=> {
//         resolve(2)
//     },500)
// })
// Promise.race([p1,p2]).then(res=> {
//     console.log(res);
// })

async function a() {
    let temp = async function(type='全部',state='全部',sort='人气',page=1) {
        let url = `${baseUrl}${labelBase}-${TYPE_MAP.get(type)}-${STATE_MAP.get(state)}-${SORT_MAP.get(sort)}-p${page}/`
        return new Promise((resolve,reject)=> {
            let requestPromise = new Promise((resolve,reject)=> {
                http.get(
                    url,
                    function(res) {
                        let html = ''
                        res.on('data',function(res) {
                            html+=res
                        })
                        res.on('end', async function(res) {
                            let searchPageList = await getData.getLabelPageList(html)
                            resolve(searchPageList)
                        })
                    }
                )
            })
            let timeoutPromise = new Promise((resolve,reject)=>{
                setTimeout(()=> {
                    resolve(-1)
                },20000)
            })
            Promise.race([requestPromise,timeoutPromise]).then(res=> {
                if(res==-1) {
                    resolve(504)
                }else {
                    resolve(res)
                }
            })
        })
        
    }
    for(let page = 871;page<=1354;page++) {
        try {
            console.log('page',page);
            let res = await temp('全部','全部','人气',page)
            console.log(res);
            if(res==504) page--
        } catch (error) {
            console.error(error);
        }
    }
}
a()