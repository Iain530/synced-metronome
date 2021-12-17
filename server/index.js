var config = require('./config').config;

var app = require('http').createServer(handler);
var io = require('socket.io')(app, {
    path: config.socketio.path,
});
var fs = require('fs');
var path = require('path');

var PORT = 8081;

app.listen(PORT);


console.log('Server listening at http://localhost:' + PORT);

function handler(req, res) {
    console.log('request', req.url);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/' || req.url === 'index.html') {
        return sendFile(__dirname + '/index.html', res);
    }

    res.writeHead(404);
    res.end('Not found');
}

io.on('connection', function (socket) {
    console.log('Connection made!')
    socket.on('timesync', function (data) {
        console.log('message', data);
        socket.emit('timesync', {
            id: data && 'id' in data ? data.id : null,
            result: Date.now()
        });
    });
});

function sendFile(filename, res, headers) {
    fs.readFile(filename,
        function (err, data) {
            if (err) {
                res.writeHead(500, headers);
                return res.end('Error loading ' + filename.split('/').pop());
            }

            res.writeHead(200, headers);
            res.end(data);
        });
}