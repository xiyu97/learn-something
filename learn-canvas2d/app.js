const http = require('http')
const fs = require('fs')
const httpPort = 8080

http
    .createServer((req, res) => {
        console.log('req.url:' + req.url)

        // URL重写规则
        function reWrite() {
            var indexFile = './index.html'
            if (req.url.indexOf('/subapp/test01') == 0) {
                indexFile = './subapp/test01/index.html'
            }
            if (req.url.indexOf('/subapp/base-common') == 0) {
                indexFile = './subapp/base-common/index.html'
            }

            fs.readFile(indexFile, 'utf-8', (err, content) => {
                if (err) {
                    console.log('We cannot open "index.html" file.')
                }
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                })

                res.end(content)
            })
        }

        // 是否是目录
        if (req.url[req.url.length - 1] == '/') {
            reWrite()
            return
        }

        //文件是否存在
        fs.access('.' + req.url, function (err) {
            console.log(err)
            if (!err) {
                // 文件存在
                var contentType = '' //文件类型
                var encoding = '' //编码
                var suffix = req.url
                    .substr(req.url.lastIndexOf('.'), req.url.length)
                    .toLowerCase()
                switch (suffix) {
                    case '.css':
                        contentType = 'text/css; charset=utf-8'
                        encoding = 'utf-8'
                        break
                    case '.js':
                        contentType = 'application/javascript; charset=utf-8'
                        encoding = 'utf-8'
                        break
                    case '.gif':
                        contentType = 'image/gif'
                        break
                    case '.png':
                        contentType = 'image/png'
                        break
                    case '.jpg':
                    case '.jpeg':
                        contentType = 'image/jpeg'
                        break
                    case '.html':
                        contentType = 'text/html; charset=utf-8'
                        encoding = 'utf-8'
                        break
                    default:
                        contentType = ''
                        break
                }

                // 读取文件并返回
                fs.readFile('.' + req.url, encoding, (err, content) => {
                    if (err) {
                        console.log('We cannot open "index.html" file.')
                        return
                    }
                    console.log('.' + req.url)
                    res.writeHead(200, {
                        'Content-Type': contentType,
                    })

                    res.end(content)
                })
                return
            } else {
                // 文件不存在
                reWrite()
            }
        })
    })
    .listen(httpPort, () => {
        console.log('Server listening on: http://localhost:%s', httpPort)
    })