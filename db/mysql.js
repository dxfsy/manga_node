const mysql = require('mysql')
const {MYSQL_CONF} = require('../conf/db')


// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)
// 开始链接
con.connect()
// 统一执行sql的函数
function exec(sql) {
    const promise = new Promise((resolve,reject)=> {
        con.query(sql,(err,result)=> {
        if(err) {
            reject(err)
            return 
        }
            resolve(result)
        })
    })
    return promise
}

// 测试
// let sql = 'select * from user where id = 2'
// con.query(sql,(err,result)=> {
//     if(err) {
//         console.error(err);
//         return 
//     }
//     console.log(result);
// })

// con.end((err)=> {
//     console.log('mysql close');
// })

module.exports = {
    exec,
    escape: mysql.escape
}