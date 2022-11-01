## 1. 获取首页数据
**/comic/home**

methods:get

返回示例：
```
{
    "data": {
        "banner": [
            {
                "src": "localhost:8081/image/indexPage/banner/b42bab747e364378.jpg",
                "comicId": "/266bz/"
            },
            ......
        ],
        "hotRecommend": [
            {
                "imageUrl": "localhost:8081/image/indexPage/hotRecommend/20191203160605_180x240_20.jpg",
                "comicId": "/242bz/",
                "title": "籃球少年王",
                "subTitle": "運動"
            },
            ......
        ],
        "rank": [
            {
                "imageUrl": "localhost:8081/image/indexPage/rank/20191203152816_320x246_33.jpg",
                "comicId": "/134bz/",
                "title": "不過是蜘蛛什么的",
                "label": [
                    "冒險"
                ]
            },
            ......
        ],
        "editRecommend": [
            {
                "imageUrl": "localhost:8081/image/indexPage/editRecommend/20191203162547_180x240_21.jpg",
                "comicId": "/249bz/",
                "title": "名偵探柯南",
                "label": [
                    "懸疑"
                ]
            },
            ......
        ],
        "category": [
            {
                "label": "熱血",
                "info": [
                    {
                        "imageUrl": "localhost:8081/image/indexPage/category/20201027232912_180x240_37.jpg",
                        "comicId": "/14948bz/",
                        "title": "桃源暗鬼",
                        "subTitle": [
                            "熱血"
                        ]
                    },
                    ......
                ]
            },
            {
                ......
            }
        ]
    },
    "errorno": 0
}
```

## 2. 获取漫画详情页
**/comic/detail**

```
methods:post,
params:{
    comicId
}
```

返回示例：
```
{
    "data": {
        "comicName": "此愛非戀",
        "author": "梅澤麻里奈",
        "state": "連載中",
        "label": [
            "戀愛"
        ],
        "updateTime": "倒序連載中|共41章,2020-01-09最新第6話",
        "chpaterList": [
            {
                "chapterTitle": "第6話（30P）",
                "chapterId": "/m92036/"
            },
            ......
        ]
    },
    "errorno": 0
}
```

## 3. 获取漫画页
**/comic/page**
```
methods:post,
params: {
    comicId,
    chapterId,
    page
}
```

返回示例：
```
{
    "message": "localhost:8081/image/detailPage/266bz/m19216/10.jpg",
    "errorno": 0
}
```

## 4. 获取搜索页内容
**/comic/search**
```
methods:get
query:{
    title,
    page
}
```
返回示例:
```
{
    "data": {
        "searchTitle": "“ 約定的夢幻島”相近搜索結果（5824）",
        "searchDataList": [
            {
                "imageUrl": "localhost:8081/image/searchPage/20191203105842_180x240_27.jpg",
                "detail": {
                    "comicId": "/83bz/",
                    "title": "約定的夢幻島",
                    "state": "完結",
                    "chapterId": "/m157081/",
                    "text": "第185話 "
                }
            },
            {
                ......
            },
            ......
        ],
        "total": 5824
    },
    "errorno": 0
}
```

## 5. 获取标签
**/comic/labels**
```
methods:get
```
返回示例：
```
{
    "data": {
        "type": [
            "全部",
            "热血",
            "恋爱",
            "校园",
            "冒险",
            "科幻",
            "生活",
            "悬疑",
            "运动"
        ],
        "state": [
            "全部",
            "连载中",
            "完结"
        ],
        "sort": [
            "人气",
            "更新时间"
        ]
    },
    "errorno": 0
}
```

## 6. 获取标签页信息
**/comic/label**
```
methods:post
params: {
    {
        "type":"全部",
        "state": "全部",
        "sort": "人气",
        "page": 2
    }
}
```
返回示例：
```
{
    "data": [
        {
            "comicId": "/87bz/",
            "imageUrl": "localhost:8081/image/labelPage/20191203111000_180x240_17.jpg",
            "title": "致不滅的你",
            "state": "最新",
            "chapterId": "/m177335/",
            "chapterTitle": "致不滅的你 第143.2話"
        },
        ......
    ],
    "errorno": 0
}
```