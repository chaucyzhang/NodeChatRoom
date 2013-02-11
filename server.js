var http = require("http");
var mime = require("mime");
var fs = require("fs");
var path = require("path");
var cache = {};


function send404Error(response){
    response.writeHead(404,{"Content-Type":"text-plain"});
    response.write("<h1> Error 404, Resource not found </h1>");
    response.end();
}

function sendFile(response,filePath,content){
    response.writeHead(200,{"Content-Type":mime.lookup(path.basename(filePath))});
    response.end(content);
}

function serveStatic(response,cache,absPath){
    if (cache[absPath]) {
        sendFile(response,absPath,cache[absPath]);
    }else{
        fs.exists(absPath,function(existing){
            if (existing) {
                fs.readFile(absPath,function(err,data){
                   if (err) {
                       send404Error(response);
                   } 
                   else{
                       cache[absPath]=data;
                       sendFile(response,absPath,data);
                   }
                });
            }
            else{
                 send404Error(response);   
            }
        });
    }
}

var server = http.createServer(function(request, response){
    var filePath =false;
    if (request.url=="/") {
      filePath = "public/Index.html";   
    }else{
      filePath = "public" + request.url;
    }
    
    var absPath ="./" + filePath; 
    serveStatic(response,cache,absPath);
});

server.listen(process.env.PORT,process.env.IP);

var chatServer = require("./lib/chat_server");
chatServer.listen(server);


