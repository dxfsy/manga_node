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
    if(res1.length == 0) {
        return -2 // 用户名或者密码错误
    }else {
        let res2 = await exec(
            `update user set password='${genPassword(newPassword)}' where username=${username}`
        )
        console.log(res2);
        if(res2.affectedRows>0) {
            return 1 // 更新成功
        }else {
            return -1 // 更新失败
        }
    }
}
module.exports = {
    register,
    login,
    updatePassword
}