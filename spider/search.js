const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const superagent = require('superagent')
const api = require('./utils.js')

let url = "http://www.mangabz.com/"

//----------------getData-------------------------
// 首页所有数据
exports.getIndexPageList = async function(html) {
    if (html) {
        // api.checkFileExist('./htmlStore/indexPage')
        // fs.writeFile(path.resolve(__dirname,'./htmlStore/indexPage/indexPage.html'), html, err => {  })
        let $ = cheerio.load(html)
        let mangaList = {}
        let banner = []
        let hotRecommend = []
        let rank = []
        let editRecommend = []
        let rankSpeed = []
        let category = []

        // banner模块
        let $as = $('.banner-con').find('.container').find('a')
        for (let i = 0; i < $as.length; i++) {
            let src = $as.eq(i).find('img').attr('src')
            let comicId = $as.eq(i).attr('href') // 资源唯一标识
            src = await api.switchToLocal(src, '../../resource/image/indexPage/banner')
            banner.push({
                src,
                comicId
            })
        }
        // 人气推荐模块
        let renqiList = $('.list-con-1').find('.index-manga-item')
        for (let i = 0; i < $as.length; i++) {
            let obj = {}
            let cur = renqiList.eq(i)
            let comicId = cur.find('a').attr('href')
            let imageUrl = cur.find('img').attr('src')
            imageUrl = await api.switchToLocal(imageUrl, '../../resource/image/indexPage/hotRecommend')
            let title = cur.find('.index-manga-item-title').find('a').text()
            let subTitle = cur.find('.index-manga-item-subtitle').find('span').text()
            obj = {
                imageUrl,
                comicId,
                title,
                subTitle
            }
            hotRecommend.push(obj)
        }

        // 热度排行模块
        let reduList = $('.rank-list').find('div[class^=rank-item-]')
        for (let i = 0; i < reduList.length; i++) {
            let obj = {}
            let cur = reduList.eq(i)
            let comicId = cur.find('a').attr('href')
            let imageUrl = cur.find('img').attr('src')
            imageUrl = await api.switchToLocal(imageUrl, '../../resource/image/indexPage/rank')
            let title = cur.find('.rank-item-title').find('a').text()
            let label = []
            let labels = cur.find('.rank-item-right').find('span')
            for (let i = 0; i < labels.length; i++) {
                label.push(labels.eq(i).text())
            }
            obj = {
                imageUrl,
                comicId,
                title,
                label
            }
            rank.push(obj)
        }

        // 编辑推荐模块
        let editList = $('.list-con-2').find('.swiper-slide')
        for (let i = 0; i < editList.length; i++) {

            let cur = editList.eq(i).find('.index-manga-item')

            for (let i = 0; i < cur.length; i++) {
                let obj = {}
                let comicId = cur.eq(i).find('a').attr('href')
                let imageUrl = cur.eq(i).find('a').find('img').attr('src')
                imageUrl = await api.switchToLocal(imageUrl, '../../resource/image/indexPage/editRecommend')
                let title = cur.eq(i).find('.index-manga-item-title').find('a').text()
                let label = []
                let labels = cur.eq(i).find('.index-manga-item-subtitle').find('span')
                for (let i = 0; i < labels.length; i++) {
                    label.push(labels.eq(i).text())
                }
                obj = {
                    imageUrl,
                    comicId,
                    title,
                    label
                }
                editRecommend.push(obj)
            }


        }

        // 上升最快模块
        let rankList = $('.carousel-right-list').find('.carousel-right-item')
        for(let i=0;i < rankList.length;i++) {
            let cur = rankList.eq(i)
            let imageUrl = cur.find('img').attr('src')
            imageUrl = await api.switchToLocal(imageUrl,'../../resource/image/indexPage/speedRank')
            let comicId = cur.find('.carousel-right-item-title>a').attr('href')
            let title = cur.find('.carousel-right-item-title>a').text()
            let author = cur.find('.carousel-right-item-subtitle').text()
            let subTitle = []
            let subTitleList = cur.find('.carousel-right-item-tag > span')
            for(let i=0;i<subTitleList.length;i++) {
                let cur = subTitleList.eq(i)
                subTitle.push(cur.text())
            }
            let content = cur.find('.carousel-right-item-content').text()
            rankSpeed.push({
                imageUrl,
                comicId,
                title,
                author,
                subTitle,
                content
            })
        }

        // 热门分类
        let categoryTitle = $('div[id=hotCatgoryId]').find('.list-con-title-class').find('a')
        for (let i = 0; i < categoryTitle.length; i++) {
            let obj = {}
            let label = $('div[id=hotCatgoryId]').find('.list-con-title-class').find('a').eq(i).text()
            let info = []
            let list = $('div[id=hotCatgoryId]').find('.index-manga-list').eq(i).find('.index-manga-item')
            for (let j = 0; j < list.length; j++) {
                let comicId = list.eq(j).find('a').attr('href')
                let imageUrl = list.eq(j).find('a').find('img').attr('src')
                imageUrl = await api.switchToLocal(imageUrl, '../../resource/image/indexPage/category')
                let title = list.eq(j).find('.index-manga-item-title').text()
                let subTitle = []
                let subTitleList = list.eq(j).find('.index-manga-item-subtitle').find('span')
                for (let i = 0; i < subTitleList.length; i++) {
                    subTitle.push(subTitleList.eq(i).text())
                }
                info.push({
                    imageUrl,
                    comicId,
                    title,
                    subTitle
                })
            }
            obj = {
                label,
                info
            }
            category.push(obj)
        }

        mangaList = {
            banner,
            hotRecommend,
            rank,
            editRecommend,
            category,
            rankSpeed
        }
        // console.log(mangaList);
        // fs.writeFile(path.resolve(__dirname,'./htmlStore/indexPage/IndexPagedata.json'),JSON.stringify(mangaList),err=>{})
        return mangaList
    }
}
// 获取详情页数据（根据唯一标识）
exports.getDetailPageList = async function(html,comicId) {
    if (html) {
        // api.checkFileExist('./htmlStore/detailPage')
        fs.writeFile(path.resolve(__dirname,'./htmlStore/detailPage/detailPage.html'), html, err => { })
        let $ = cheerio.load(html)
        let detailPageList = {}

        let notFound = $('.img-404').attr('src')
        if(notFound) return {code:404,message:'资源不存在'}
        // 作品信息
        
        let coverUrl = $('.detail-info-1').find('.detail-info-cover').attr('src')
        coverUrl = await api.switchToLocal(coverUrl, `../../resource/image/detailPage/${comicId}/detailCover`)
        let comicName = $('.detail-info-title').text().trim()
        let author = $('.detail-info-tip>span').eq(0).find('a').text()
        let state = $('.detail-info-tip>span').eq(1).find('span').text()
        let label = []
        let span = $('.detail-info-tip > span').eq(2).find('span')
        for (let i = 0; i < span.length; i++) {
            label.push(span.eq(i).text())
        }
        let updateTime = $('.detail-list-form-title').text().replace(/\s*/g,"")
        let content = $('.detail-info-content').text()
        // 章节
        let chapterList = []
        let chapters = $('.detail-list-form-con').find('.detail-list-form-item')
        for (let i = 0; i < chapters.length; i++) {
            let obj = {}
            let cur = chapters.eq(i)
            let chapterTitle = cur.text().replace(/\s*/g,"")
            let chapterId = cur.attr('href')
            obj = {
                chapterTitle,
                chapterId
            }
            chapterList.push(obj)
        }


        detailPageList = {
            comicName,
            author,
            coverUrl,
            state,
            label,
            content,
            updateTime,
            chapterList,
        }
        // fs.writeFile(path.resolve(__dirname,'./htmlStore/detailPage/detailPage.json'),JSON.stringify(detailPageList),err=>{})
        return detailPageList
    }
}
// 获取漫画（根据唯一标识）
exports.getComicBookList = async function(html,url,comicId,comicChapterId,MANGABZ_PAGE) {
    // api.checkFileExist('./htmlStore/comicPage')
    // fs.writeFile(path.resolve(__dirname,'./htmlStore/comicPage/comicBook.html'), html, err => { })



    // 整理参数
    let params = execParam(html)

    let prs = {
        cid: params.MANGABZ_CID,
        page: MANGABZ_PAGE,
        key: '',
        _cid: params.MANGABZ_CID,
        _mid: params.MANGABZ_MID,
        _dt: params.MANGABZ_VIEWSIGN_DT.split(' ').join('+'),
        _sign: params.MANGABZ_VIEWSIGN,
    }

    let imageUrl = await new Promise((resolve,reject)=> {
        superagent
        .get(url + 'chapterimage.ashx?' + trans(prs))
        .set('Referer', url)
        .end(async (err,res)=> {
            if(err) {
                console.error('图片获取失败，请重新刷新');
                reject()
                return
            }
            // 这里执行eval函数，结果会保存到d变量里，所以直接用d变量接受图片地址
            eval(res.text)
            let imageRequestUrl = encodeURI(d[0])
            superagent
                .get(imageRequestUrl)
                .set('Referer',url)
                .end(async (err,res)=> {
                    let imageUrl = await api.saveToLocal(res.body,`../../resource/image/detailPage/${comicId}/${comicChapterId}`,MANGABZ_PAGE,'jpg')
                    resolve(imageUrl)
                })
            
        })
    })
    // fs.writeFile(path.resolve(__dirname,'./htmlStore/comicPage/comicBook.json'),JSON.stringify(imageUrl),err=>{})
    return {imageUrl}
}
// 获取搜索页
exports.getSearchPageList = async function(html) {
    // api.checkFileExist('./htmlStore/searchPage')
    // fs.writeFile(path.resolve(__dirname,'./htmlStore/searchPage/searchPage.html'), html, err => {  })
    let obj = {}
    let searchDataList = []
    let $ = cheerio.load(html)
    let searchTitle = $('.result-title').text().trim()
    let total = Math.ceil(searchTitle.match(/\d+/))
    let searchList = $('.mh-list').find('.mh-item')
    for(let i=0;i<searchList.length;i++) {
        let cur = searchList.eq(i)
        let comicId = $('.mh-item>a').attr('href')
        let imageUrl = cur.find('img').attr('src')
        imageUrl = await api.switchToLocal(imageUrl,'../../resource/image/searchPage')
        let title = cur.find('.mh-item-detali .title > a').attr('title')
        let state = cur.find('.chapter > span').text()
        let chapterId = cur.find('.chapter > a').attr('href')
        let text = cur.find('.chapter > a').text()
        let detail = {
            comicId,
            title,
            state,
            chapterId,
            text
        }
        searchDataList.push({
            imageUrl,
            detail,
            
        })
    }
    obj = {
        searchTitle,
        searchDataList,
        total
    }
    // fs.writeFile(path.resolve(__dirname,'./htmlStore/searchPage/searchPage.json'),JSON.stringify(obj),err=>{})
    return obj
}
// 获取标签页
exports.getLabelPageList = async function (html) {
    // api.checkFileExist('./htmlStore/labelPage')
    // fs.writeFile(path.resolve(__dirname,'./htmlStore/labelPage/labelPage.html'), html, err => {  })
    let $ = cheerio.load(html)
    let labelDataList = []
    let labelList = $('.mh-list').find('.mh-item')
    for(let i=0;i<labelList.length;i++) {
        let cur = labelList.eq(i)
        let imageUrl = cur.find('img').attr('src')
        imageUrl = await api.switchToLocal(imageUrl,'../../resource/image/labelPage')
        let comicId = $('.mh-list').find('.mh-item > a').eq(i).attr('href')
        let title = cur.find('.title > a').attr('title')
        let state = cur.find('.chapter span').text()
        let chapterId = cur.find('.chapter > a').attr('href')
        let chapterTitle = cur.find('.chapter > a').attr('title')
        labelDataList.push({
            comicId,
            imageUrl,
            title,
            state,
            chapterId,
            chapterTitle
        })
    }
    // fs.writeFile(path.resolve(__dirname,'./htmlStore/labelPage/labelPage.json'),JSON.stringify(labelDataList),err=>{})
    return labelDataList
}

//------------------------------------------------




//--------------------execParam-------------------

// 提取script里的参数 
function execParam(html){
    let $ = cheerio.load(html)
    let $script = $('head').find('script')
    let param_not_modified = ''
    for(let i=0;i<$script.length;i++) {
        let cur = $script.eq(i)
        if(cur.html().indexOf('var MANGABZ_CID')!=-1) {
            param_not_modified = cur.html()
        }
    }
    
    param_not_modified = param_not_modified.replace(
        'reseturl(window.location.href, MANGABZ_CURL.substring(0, MANGABZ_CURL.length - 1));',
        ''
    )

    let param_modified = {}
    param_not_modified.split('var')
        .map(item=>item.trim())
        .filter(item=> item.length!==0)
        .map(item=>item.replace(/(\"|;|')/gi, ''))
        .forEach(item=> {
            let [key,val] = item.split('=').map(item=>item.trim())
            param_modified[key] = val.replace(/(\"|;|')/gi, '')
        })

    return param_modified
}

// 将参数拼接成url参数的形式
function trans(map) {
    var s = ''
    for (var i in map) {
      s += i + '=' + encodeURIComponent(map[i]) + '&'
    }
    return s.slice(0, s.length - 1)
}



//------------------------------------------------




