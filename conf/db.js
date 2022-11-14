const env = 'dev'// 环境参数

let MYSQL_CONF 

// 开发环境下
if(env == 'dev') {
    MYSQL_CONF = {
        host:'localhost',
        user:'root',
        password:'lvjiaqi',
        port:'3306',
        database: 'comic'
    }
}

module.exports = {
    MYSQL_CONF,
}