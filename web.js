var mime = require('mime');
var url = require('url');
var fs = require('fs');
var http = require('http');
var server = http.createServer(function(request, response){
    // url.parse:把?後面的參數(GET參數)省略
    var pathname = url.parse(request.url, true).pathname;
    if(pathname.endsWith('/')){
        pathname += '/index.html';
    }else { 
        if (!pathname.includes('.')){
            // 檢查使用者輸入的參數
            response.writeHead(301, {
                'Location': pathname + '/' + (url.parse(request.url, true).search || "")
            })
            response.end();
            return;
        }
    }
    fs.stat('.' + pathname, function(err,stats){
        if(!err && stats.isDirectory()){
            response.writeHead(302, {
                'Location': pathname + '/' + (url.parse(request.url, true).search || "")
            })
            response.end();
            return;
        }
        //console.log(err,stats)
        if (!err && stats.isFile()){
            fs.readFile('.' + pathname, function(err, html){
                if(!err){
                    response.writeHead(200, {
                        'Content-Type': mime.getType(pathname)
                        //'Content-Type' : 'text/html'
                        //'Content-Type' : 'image/png'
                        //'Content-Type' : 'application/zip'
                    })
                    response.write(html);
                    response.end();
                }
            }); 
        } else {
            response.writeHead(404);
            response.write('Not Found');
            response.end();

        }
    })
});
server.listen(3000, '127.0.0.1');