const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const register = async (username, password) => {
    let res1 = await exec(`select username from user where username = ${escape(username)}`)
    if (res1.length == 0) {
        let res2 = await exec(`insert into user (username, password) values (${escape(username)}, '${genPassword(escape(password))}');`)
        return {
            id: res2.insertId,
        }
    } else {
        return -1
    }
}

const login = async (username, password) => {
    username = escape(username)
    password = escape(password)
    let res = await exec(
        `select username from user where username = ${username} and password = '${genPassword(password)}'`
    )
    return res
}

const updatePassword = async (username, oldPassword, newPassword) => {
    username = escape(username)
    oldPassword = escape(oldPassword)
    newPassword = escape(newPassword)
    let res1 = await
        exec(
            `select username from user where username = ${username} and password = '${genPassword(oldPassword)}'`
        )
    if (res1.length == 0) {
        return -2 // 用户名或者密码错误
    } else {
        let res2 = await exec(
            `update user set password='${genPassword(newPassword)}' where username=${username}`
        )
        if (res2.affectedRows > 0) {
            return 1 // 更新成功
        } else {
            return -1 // 更新失败
        }
    }
}

const updateHistory = async (username, comicId, comicTitle, chapterHistoryId, chapterHistoryName, chapterHistoryTotal, chapterLastestId, chapterLastestName, chapterLastestTotal) => {
    let res1 = await exec(`
        select * from comicInfo where username = '${username}' and comicId = '${comicId}'`
    )
    // 表示用户没看过此漫画（即还没加入信息至数据库）
    if (res1.length == 0) {
        let res2 = await exec(
            `insert into comicInfo (username, comicId,comicTitle,chapterHistoryId,chapterHistoryName,chapterHistoryTotal,chapterLastestId,chapterLastestName,chapterLastestTotal,isCollect) 
            values ('${username}', '${comicId}','${comicTitle}','${chapterHistoryId}','${chapterHistoryName}',${chapterHistoryTotal},'${chapterLastestId}','${chapterLastestName}','${chapterLastestTotal}','${0}')`
        )
        if (res2 !== undefined && res2.insertId !== undefined) {
            return 1
        } else {
            return -1
        }
    } else {
        // 用户已看过此漫画，只需更新至用户所看的最新章节
        let res3 = await exec(
            `update comicInfo set chapterHistoryId='${chapterHistoryId}' , chapterHistoryName = '${chapterHistoryName}' , chapterHistoryTotal = '${chapterHistoryTotal}', chapterLastestId = '${chapterLastestId}' , chapterLastestName = '${chapterLastestName}' , chapterLastestTotal = '${chapterLastestTotal}'  where username='${username}' and comicId='${comicId}'`
        )
        if (res3.affectedRows > 0) {
            return 1 // 更新成功
        } else {
            return -1 // 更新失败
        }
    }
}

const updateCollect = async (username, comicId, comicTitle, chapterLastestId, chapterLastestName, chapterLastestTotal, isCollect) => {
    let res1 = await exec(`
    select * from comicInfo where username = '${username}' and comicId = '${comicId}'`
    )
    // 表示用户没看过此漫画（即还没加入信息至数据库）
    if (res1.length == 0) {
        let res2 = await exec(
            `insert into comicInfo (username, comicId,comicTitle,chapterLastestId,chapterLastestName,chapterLastestTotal,isCollect) 
                values ('${username}', '${comicId}','${comicTitle}','${chapterLastestId}','${chapterLastestName}','${chapterLastestTotal}','${isCollect}')`
        )
        if (res2 !== undefined && res2.insertId !== undefined) {
            return 1
        } else {
            return -1
        }
    } else {
        // 用户看过此漫画（信息已加入数据库，只需更新isCollect字段）
        let res3 = await exec(
            `update comicInfo set isCollect='${isCollect}' where username='${username}' and comicId = '${comicId}'`
        )
        if (res3.affectedRows > 0) {
            return 1 // 更新成功
        } else {
            return -1 // 更新失败
        }
    }
}

const getComicHistory = async (username,comicId)=> {
    let res = await exec(
        `select chapterHistoryId,chapterHistoryName,chapterHistoryTotal from comicInfo where username = '${username}' and comicId = '${comicId}'`
    )
    if(res.length!==0) {
        // 获取成功
        return res[0]
    }else {
        // 获取失败或者没有该数据
        return -1
    }
}

const getComicCollect = async(username,comicId)=> {
    let res = await exec(
        `select isCollect from comicInfo where username = '${username}' and comicId = '${comicId}'`
    )
    if(res.length!==0) {
        // 获取成功
        return res[0]
    }else {
        // 获取失败或者没有该数据
        return -1
    }
}

module.exports = {
    register,
    login,
    updatePassword,
    updateHistory,
    updateCollect,
    getComicHistory,
    getComicCollect
}