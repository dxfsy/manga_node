const request = require('superagent')
// 获取ip(青果云)
url = 'https://proxy.qg.net/extract?Key=55081235&Num=1&AreaId=&Isp=&DataFormat=txt&DataSeparator=%5Cr%5Cn&Detail=0'
async function getIp() {
    let res = await request.get(url)
    console.log('new ProxyIp:' + res.text);
    return res.text
}

module.exports = {
    getIp
}