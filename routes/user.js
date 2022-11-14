const express = require('express')
const router = express.Router()
const { register, login, updatePassword, updateHistory, updateCollect, getComicHistory,getComicCollect } = require('../controller/user')
const { generateToken, verifyToken } = require('../utils/authorization')
const { SuccessModel } = require('../model/resModel')

router.post('/register', async (req, res, next) => {
    console.log('/user/register post');
    let { username, password, againPassword } = req.body
    if (!username) {
        res.json(new SuccessModel({
            code: -1,
            message: '用户名不能为空'
        }))
    }
    else if (!password) {
        res.json(new SuccessModel({
            code: -1,
            message: '密码不能为空'
        }))
    } else if (!againPassword || againPassword !== password) {
        res.json(new SuccessModel({
            code: -1,
            message: '请确认新密码或两次新密码不一致'
        }))
    }
    else {
        let result = await register(username, password)
        if (result === -1) {
            res.json(new SuccessModel({
                code: -1,
                message: '用户名已被注册'
            }))
        } else {
            res.json(new SuccessModel({
                code: 200,
                message: '注册成功',
                ...result,
            }))
        }

    }
})

router.post('/login', async (req, res, next) => {
    console.log('/user/login post');
    let { username, password } = req.body
    if (!username) {
        res.json(new SuccessModel({
            code: -1,
            message: '用户名不能为空'
        }))
    }
    else if (!password) {
        res.json(new SuccessModel({
            code: -1,
            message: '密码不能为空'
        }))
    } else {
        let result = await login(username, password)
        if (result.length == 0) {
            res.json(new SuccessModel({
                code: -1,
                message: '用户名不存在或密码错误'
            }))
        } else {
            let token = generateToken({ username: result[0].username })
            res.json(new SuccessModel({
                code: 200,
                message: '登录成功',
                username: result[0].username,
                token,
            }))
        }
    }
})

router.post('/updatePassword', async (req, res, next) => {
    console.log('/user/updatePassword post');
    let { username, oldPassword, newPassword, againPassword } = req.body
    if (!username) {
        res.json(new SuccessModel({
            code: -1,
            message: '用户名不能为空'
        }))
    }
    else if (!oldPassword) {
        res.json(new SuccessModel({
            code: -1,
            message: '旧密码不能为空'
        }))
    } else if (!newPassword) {
        res.json(new SuccessModel({
            code: -1,
            message: '新密码不能为空'
        }))
    } else if (!againPassword || againPassword !== newPassword) {
        res.json(new SuccessModel({
            code: -1,
            message: '请确认新密码或两次新密码不一致'
        }))
    } else {
        // 修改密码
        let result = await updatePassword(username, oldPassword, newPassword)
        if (result == -2) {
            res.json(new SuccessModel({
                code: -1,
                message: "用户名不存在或密码错误"
            }))
        } else if (result == 1) {
            res.json(new SuccessModel({
                code: 200,
                message: "密码更新成功"
            }))
        } else {
            res.json(new SuccessModel({
                code: -1,
                message: "密码更新失败，请重试"
            }))
        }
    }
})

router.get('/isLogin', verifyToken, (req, res, next) => {
    res.json(new SuccessModel({
        code: 200
    }))
})

router.post('/history', async (req, res, next) => {
    console.log('/user/history post');
    let {
        username,
        comicId,
        comicTitle,
        chapterHistoryId,
        chapterHistoryName,
        chapterHistoryTotal,
        chapterLastestId,
        chapterLastestName,
        chapterLastestTotal
    } = req.body
    let result = await updateHistory(username,
        comicId,
        comicTitle,
        chapterHistoryId,
        chapterHistoryName,
        chapterHistoryTotal,
        chapterLastestId,
        chapterLastestName,
        chapterLastestTotal)
    if (result == 1) {
        res.json(new SuccessModel({
            code: 200,
            message: '历史更新成功'
        }))
    } else if (result == 2) {
        res.json(new SuccessModel({
            code: -1,
            message: '历史更新失败'
        }))
    }
})

router.post('/collect', async (req, res, next) => {
    console.log('/user/collect post');
    let {
        username,
        comicId,
        comicTitle,
        chapterLastestId,
        chapterLastestTitle,
        chapterLastestTotal,
        isCollect
    } = req.body
    if (isCollect !== 0 && isCollect !== 1) {
        isCollect = 0
    }
    console.log(req.body);
    let result = await updateCollect(username, comicId, comicTitle, chapterLastestId, chapterLastestTitle, chapterLastestTotal, isCollect)
    if (result == 1) {
        res.json(new SuccessModel({
            code: 200,
            message: '收藏状态更新成功'
        }))
    } else {
        res.json(new SuccessModel({
            code: 200,
            message: '收藏状态更新失败，请重试'
        }))
    }
})

router.post('/comicHistory', async (req, res, next) => {
    let { username, comicId } = req.body
    console.log('/user/comicHistory get');
    let result = await getComicHistory(username, comicId)
    if(result !== -1) {
        res.json(new SuccessModel({
            code:200,
            history: result
        }))
    }else {
        res.json(new SuccessModel({
            code:-1,
            message:'没有浏览历史'
        }))
    }
})

router.post('/comicCollect',async(req,res,next)=> {
    let {username,comicId} = req.body
    let result = await getComicCollect(username,comicId)
    if(result!==-1) {
        res.json(new SuccessModel({
            code:200,
            isCollect: result
        }))
    }else {
        res.json(new SuccessModel({
            code:-1,
            isCollect:0
        }))
    }
})
module.exports = router;