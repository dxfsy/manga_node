const TYPE_MAP = new Map([
    ['全部','0'],
    ['热血','31'],
    ['恋爱','26'],
    ['校园','1'],
    ['冒险','2'],
    ['科幻','25'],
    ['生活','11'],
    ['悬疑','17'],
    ['运动','34'],
])
const STATE_MAP = new Map([
    ['全部','0'],
    ['连载中','1'],
    ['完结','2']
]) 
const SORT_MAP = new Map([
    ['人气','10'],
    ['更新时间','2']
])
const labels = {
    type: ["全部","热血","恋爱","校园","冒险","科幻","生活","悬疑","运动"],
    state: ["全部","连载中","完结"],
    sort: ["人气","更新时间"]
}

module.exports = {
    TYPE_MAP,
    STATE_MAP,
    SORT_MAP,
    labels
}