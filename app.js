const express = require('express');
let app = express();
const cors = require('cors');
const bodyParser = require('body-parser'); // 处理req.body

const comic = require('./routes/comic.js')
const user = require('./routes/user.js')

app.use(bodyParser.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use('/comic',comic)
app.use('/user',user)

app.use((err, req, res, next) => {
    console.log('发生了错误！' + err.message)
    res.send('Error：' + err.message)
})

app.listen("3000",()=>{
    console.log("服务器启动3000端口")
})
