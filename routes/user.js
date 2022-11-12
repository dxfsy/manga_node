const express = require('express')
const router = express.Router()
const { register, login,updatePassword } = require('../controller/user')
const { generateToken } = require('../utils/authorization')
const { SuccessModel } = require('../model/resModel')

router.post('/register', async (req, res, next) => {
    console.log('/user/register post');
    let { username, password } = req.body
    if (!username) {
        res.json(new SuccessModel('用户名不能为空'))
    }
    else if (!password) {
        res.json(new SuccessModel('密码不能为空'))
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
        res.json(new SuccessModel('用户名不能为空'))
    }
    else if (!password) {
        res.json(new SuccessModel('密码不能为空'))
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
                token,
            }))
        }
    }
})

router.post('/updatePassword', async (req, res, next) => {
    console.log('/user/updatePassword post');
    let { username, oldPassword, newPassword, againPassword } = req.body
    if (!username) {
        res.json(new SuccessModel('用户名不能为空'))
    }
    else if (!oldPassword) {
        res.json(new SuccessModel('旧密码不能为空'))
    } else if (!newPassword) {
        res.json(new SuccessModel('新密码不能为空'))
    } else if (!againPassword || againPassword !== newPassword) {
        res.json(new SuccessModel('请确认新密码或两次新密码不一致'))
    } else {
        // 修改密码
        let result = await updatePassword(username, oldPassword, newPassword)
        if(result == -2) {
           res.json(new SuccessModel("用户名不存在或密码错误"))
        }else if(result == 1) {
            res.json(new SuccessModel("密码更新成功"))
        }else {
            res.json(new SuccessModel("密码更新失败，请重试"))
        }
    }
})

module.exports = router;