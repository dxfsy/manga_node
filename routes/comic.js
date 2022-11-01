const express = require('express')
const router = express.Router()
const { SuccessModel } = require('../model/resModel')
const { getIndexList,getDetailPageList,getComic,getSearchList,getLabelList,getLabels } = require('../spider/request')

router.get('/home',async (req,res,next)=> {
    console.log('someone get homeList');
    let list = await getIndexList()
    list = JSON.parse(list)
    res.json(new SuccessModel(list))
})

router.post('/detail',async (req,res,next)=> {
    let { comicId } = req.body
    let list = await getDetailPageList(comicId)
    res.json(new SuccessModel(list))
})

router.get('/labels',async (req,res,next)=> {
    let list = await getLabels()
    res.json(new SuccessModel(list))
})

router.get('/search',async (req,res,next)=> {
    let {title,page} = req.query
    let list = await getSearchList(title,page)
    res.json(new SuccessModel(list))
})

router.post('/page',async (req,res,next)=> {
    let {comicId,chapterId,page} = req.body
    console.log(req.body);
    let list = await getComic(comicId,chapterId,page)
    res.json(new SuccessModel(list))
})

router.post('/label',async (req,res,next)=> {
    let {type,state,sort,page} = req.body
    let list = await getLabelList(type,state,sort,page)
    res.json(list)
})

module.exports = router;