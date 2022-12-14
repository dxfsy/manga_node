// const http = require('http')
const fs = require('fs')
const path = require('path')
const getData = require('./search.js')
const { TYPE_MAP, STATE_MAP, SORT_MAP, labels } = require('./htmlStore/labelPage/labelsMap')
const { userAgents } = require('../utils/userAgents')
let { getIp } = require('../utils/proxyIp')
const request = require('superagent')
const requestProxy = require('superagent-proxy');
requestProxy(request)

const baseUrl = "http://www.mangabz.com/"
const labelBase = 'manga-list'
let proxyIp = getIp()

// 请求首页数据
exports.getIndexList = async function () {
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
    return await new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, './htmlStore/indexPage/IndexPagedata.json'), 'utf8', (err, data) => {
            if (err) console.error(err);
            resolve(data)
        })
    })
}

// 请求详情页数据(传入漫画的唯一标识)
// exports.getDetailPageList = async function (comicId) {
//     return await new Promise((resolve, reject) => {
//         http.get(
//             baseUrl + comicId.slice(1),
//             function (res) {
//                 let html = ''
//                 res.on('data', function (res) {
//                     html += res
//                 })
//                 res.on('end', async function (res) {
//                     let detailPageList = await getData.getDetailPageList(html, comicId.replace(/\/*\//g, ''))
//                     resolve(detailPageList)
//                 })
//             }
//         )
//     })
//     // return await new Promise((resolve,reject)=> {
//     //     fs.readFile(path.resolve(__dirname,'./htmlStore/detailPage/detailPage.json'),'utf8',(err,data)=> {
//     //         if(err) console.error(err);
//     //         resolve(JSON.parse(data))
//     //     })
//     // })
// }
exports.getDetailPageList = async function (comicId) {
    return await new Promise((resolve, reject) => {
        request.get(baseUrl + comicId.slice(1))
            .set('User-Agent', userAgents[parseInt(Math.random() * userAgents.length)])
            .set('Referer', 'http://www.mangabz.com/')
            .proxy('http://' + '55081235:9E194826D379@' + proxyIp)
            .then(async res => {
                // console.log('当前：白名单认证模式')
                let detailPageList = await getData.getDetailPageList(res.text, comicId.replace(/\/*\//g, ''))
                resolve(detailPageList)
            }).catch(async err => {
                console.log(err.message)
                console.log('重新获取代理ip中...');
                proxyIp = await getIp()
            })
    })
    // return await new Promise((resolve,reject)=> {
    //     fs.readFile(path.resolve(__dirname,'./htmlStore/detailPage/detailPage.json'),'utf8',(err,data)=> {
    //         if(err) console.error(err);
    //         resolve(JSON.parse(data))
    //     })
    // })
}



// 请求漫画页（传入漫画的唯一标识comidId,章节的唯一标识href以及页数page）
// exports.getComic = async function (comicId, chapterId, page) {
//     return await new Promise((resolve, reject) => {
//         http.get(
//             baseUrl + chapterId.slice(1),
//             function (res) {
//                 let html = ''
//                 res.on('data', function (res) {
//                     html += res
//                 })
//                 res.on('end', async function (res) {
//                     let comicBookData = await getData.getComicBookList(html, baseUrl + chapterId.slice(1), comicId.replace(/\/*\//g, ''), chapterId.replace(/\/*\//g, ''), page)
//                     resolve(comicBookData)
//                 })
//             }
//         )
//     })
// }
exports.getComic = async function (comicId, chapterId, page) {
    return await new Promise((resolve, reject) => {
        request.get(baseUrl + chapterId.slice(1))
            .set('User-Agent', userAgents[parseInt(Math.random() * userAgents.length)])
            .set('Referer', 'http://www.mangabz.com/')
            .proxy('http://' + '55081235:9E194826D379@' + proxyIp)
            .then(async res => {
                // console.log('当前：白名单认证模式')
                let comicBookData = await getData.getComicBookList(res.text, baseUrl + chapterId.slice(1), comicId.replace(/\/*\//g, ''), chapterId.replace(/\/*\//g, ''), page, proxyIp)
                resolve(comicBookData)
            }).catch(async err => {
                console.log(err.message)
                console.log('重新获取代理ip中...');
                proxyIp = await getIp()
            })
    })
}


// 请求搜索页（传入搜索内容，以及搜索页数）
// exports.getSearchList = async function (searchKey, page) {
//     let param = `search?title=${searchKey}&page=${page}`

//     return await new Promise((resolve, reject) => {
//         http.get(
//             baseUrl + param,
//             function (res) {
//                 let html = ''
//                 res.on('data', function (res) {
//                     html += res
//                 })
//                 res.on('end', async function (res) {
//                     let searchPageList = await getData.getSearchPageList(html)
//                     resolve(searchPageList)
//                 })
//             }
//         )
//     })
// }
exports.getSearchList = async function (searchKey, page) {
    let param = `search?title=${encodeURI(searchKey)}&page=${page}`

    return await new Promise((resolve, reject) => {
        request.get(baseUrl + param)
            .set('User-Agent', userAgents[parseInt(Math.random() * userAgents.length)])
            .set('Referer', 'http://www.mangabz.com/')
            .proxy('http://' + '55081235:9E194826D379@' + proxyIp)
            .then(async res => {
                // console.log('当前：白名单认证模式')
                let searchPageList = await getData.getSearchPageList(res.text)
                resolve(searchPageList)
            }).catch(async err => {
                console.log(err.message)
                console.log('重新获取代理ip中...');
                proxyIp = await getIp()
            })
    })
}

// 请求标签分类页（传入题材，漫画状态，排序方式，页数）
// exports.getLabelList = async function (type = '全部', state = '全部', sort = '人气', page = 1) {
//     let url = `${baseUrl}${labelBase}-${TYPE_MAP.get(type)}-${STATE_MAP.get(state)}-${SORT_MAP.get(sort)}-p${page}/`
//     return new Promise((resolve, reject) => {
//         http.get(
//             url,
//             function (res) {
//                 let html = ''
//                 res.on('data', function (res) {
//                     html += res
//                 })
//                 res.on('end', async function (res) {
//                     let searchPageList = await getData.getLabelPageList(html)
//                     resolve(searchPageList)
//                 })
//             }
//         )
//     })
// }
exports.getLabelList = async function (type = '全部', state = '全部', sort = '人气', page = 1) {
    let url = `${baseUrl}${labelBase}-${TYPE_MAP.get(type)}-${STATE_MAP.get(state)}-${SORT_MAP.get(sort)}-p${page}/`
    return new Promise((resolve, reject) => {
        request.get(url)
            .set('User-Agent', userAgents[parseInt(Math.random() * userAgents.length)])
            .set('Referer', 'http://www.mangabz.com/')
            .proxy('http://' + '55081235:9E194826D379@' + proxyIp)
            .then(async res => {
                // console.log('当前：白名单认证模式')
                let searchPageList = await getData.getLabelPageList(res.text)
                resolve(searchPageList)
            }).catch(async err => {
                console.log(err.message)
                console.log('重新获取代理ip中...');
                proxyIp = await getIp()
            })
    })
}




// 请求标签
exports.getLabels = function () {
    return labels
}

// 请求漫画章节列表（在漫画页请求）
// exports.getChapterList = async function (comicId) {
//     return await new Promise((resolve, reject) => {
//         http.get(
//             baseUrl + comicId.slice(1),
//             function (res) {
//                 let html = ''
//                 res.on('data', function (res) {
//                     html += res
//                 })
//                 res.on('end', async function (res) {
//                     let chapterList = await getData.getComicChapterList(html, comicId.replace(/\/*\//g, ''))
//                     resolve(chapterList)
//                 })
//             }
//         )
//     })
// }
exports.getChapterList = async function (comicId) {
    return await new Promise((resolve, reject) => {
        request.get(baseUrl + comicId.slice(1))
            .set('User-Agent', userAgents[parseInt(Math.random() * userAgents.length)])
            .set('Referer', 'http://www.mangabz.com/')
            .proxy('http://' + '55081235:9E194826D379@' + proxyIp)
            .then(async res => {
                // console.log('当前：白名单认证模式')
                let chapterList = await getData.getComicChapterList(res.text, comicId.replace(/\/*\//g, ''))
                resolve(chapterList)
            }).catch(async err => {
                console.log(err.message)
                console.log('重新获取代理ip中...');
                proxyIp = await getIp()
            })
    })
}