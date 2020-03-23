var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    md5 = require('md5'),
    server, io;

// This is the hashed password to join the private group
// It is the md5 hasg of "pass123".
const privatePassword = '32250170a0dca92d53ec9624f336ca24';
console.log(privatePassword);

app.use('/',express.static(`${__dirname}/public`));

server = http.Server(app);
server.listen(3000);

io = socketIO(server);

io.on('connection',socket=>{
    socket.on('join.group',data=>{

        // Return and emit a message if the password don't match
        if(md5(data.password) !== privatePassword)
        return socket.emit('message.posted',{
            type: 'danger',
            message: 'Invalid password'
        });

        // Join the group
        socket.join('secret group');
        socket.emit('join.group.success');
    });

    socket.on('message.post', data=>{
        io.to('secret group').emit('message.posted',{
            type: 'muted',
            message: data.message
        });
    })
});