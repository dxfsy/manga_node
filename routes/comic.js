const express = require('express')
const router = express.Router()
const { SuccessModel } = require('../model/resModel')
const { getIndexList,getDetailPageList,getComic,getSearchList,getLabelList,getLabels } = require('../spider/request')

router.get('/home',async (req,res,next)=> {
    let list = await getIndexList()
    list = JSON.parse(list)
    console.log('/comic/home get');
    res.json(new SuccessModel(list))
})

router.post('/detail',async (req,res,next)=> {
    let { comicId } = req.body
    let list = await getDetailPageList(comicId)
    // list = JSON.parse(list)
    console.log('/comic/detail post');
    res.json(new SuccessModel(list))
})

router.get('/labels',async (req,res,next)=> {
    let list = await getLabels()
    console.log('/comic/labels get');
    res.json(new SuccessModel(list))
})

router.get('/search',async (req,res,next)=> {
    let {title,page} = req.query
    let list = await getSearchList(title,page)
    console.log('/comic/search get');
    res.json(new SuccessModel(list))
})

router.post('/page',async (req,res,next)=> {
    let {comicId,chapterId,page} = req.body
    console.log(req.body);
    let list = await getComic(comicId,chapterId,page)
    console.log('/comic/page post');
    res.json(new SuccessModel(list))
})

router.post('/label',async (req,res,next)=> {
    let {type,state,sort,page} = req.body
    let list = await getLabelList(type,state,sort,page)
    console.log('/comic/label post');
    res.json(new SuccessModel(list))
})

module.exports = router;