const path = require('path')
const fs = require('fs')
const request = require('request')

let staticUrl = "http://localhost:8081"

// 在线图片转为本地图片(传入url和保存的地址（地址直接写相对地址./image/xxx）)
// 返回本地图片地址
exports.switchToLocal = async function (target, reaPath) {
    let savePath = await this.checkFileExist(reaPath)
    let temp = target.split('/')
    let filename = temp[temp.length - 1]
    let p = new Promise((resolve, reject) => {
        fs.access(path.resolve(savePath, filename), async err => {
            if (err) {
                console.log(`${filename}不存在于当前目录中`)
                let writeStream = fs.createWriteStream(path.resolve(savePath, filename), { autoClose: true })
                request(target).pipe(writeStream)
                writeStream.on("error", function () {
                    console.log('文件保存失败')
                    reject('fail to saveFile')
                });
                writeStream.on('finish', function () {
                    reaPath = reaPath.replace('../../resource', '')
                    resolve(staticUrl + reaPath + '/' + filename)
                })
            } else {
                // console.log('文件已存在');
                reaPath = reaPath.replace('../../resource', '')
                resolve(staticUrl + reaPath + '/' + filename)
            }

        })
    })
    let res = await p
    return res
}
// 检查是否存在此文件夹
exports.checkFileExist = async function (reaPath) {
    savePath = path.resolve(__dirname, reaPath)
    if (!fs.existsSync(savePath)) {
        await fs.mkdirSync(savePath, { recursive: true });

    }
    return savePath
}
// 将blob文件（图片）写入本地，并返回本地图片地址
exports.saveToLocal = async function (blobData, reaPath, filename, type) {
    let savePath = await this.checkFileExist(reaPath)
    let imageUrl = await new Promise((resolve, reject) => {
        fs.access(path.resolve(savePath, filename + '.' + type), async err => {
            if (err) {
                console.log(`${filename}不存在于当前目录中`)
                let write = fs.writeFile(
                    path.resolve(savePath, filename + '.' + type),
                    blobData,
                    'binary',
                    function (err) {
                        if (err) console.error('保存失败');
                        else {
                            console.log('图片已保存成功');
                            resolve(staticUrl + reaPath.replace('../../resource', '') + '/' + filename + '.' + type)
                        }
                    }
                )
                // write.on('finish', function () {

                // })
            } else {
                console.log('文件已存在');
                resolve(staticUrl + reaPath.replace('../../resource', '') + '/' + filename + '.' + type)
            }
        })

    })
    return imageUrl
}
