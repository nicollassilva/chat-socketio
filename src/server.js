const Functions = require('./socket/functions');
const Express = require('express')();
const Http = require('http').Server(Express)
const Socketio = require('socket.io')(Http)
let usersConnected = [];

Socketio.on('connection', socket => {
    socket.on('userConnected', event => {
        console.log(`${event} conectou no chat! ID: ${socket.id}`)
        let myInfo = {
            id: socket.id,
            name: event,
            address: socket.handshake.address
        };

        usersConnected.push(myInfo);
        socket.emit('myInfo', myInfo)
        Socketio.emit('connected', usersConnected)
    })
    socket.on('disconnect', event => {
        try {
            let user = usersConnected.filter(e => e.id == socket.id)
            console.log(`${user[0].name || 'Anônimo'} desconectou do chat! ID: ${socket.id}`)
            usersConnected = Functions.removeByAttr(usersConnected, 'id', socket.id)
        } catch(e) {}
        
        Socketio.emit('connected', usersConnected)
    })
    socket.on('sendPrivateMessage', event => socket.to(event.to).emit('receivePrivateMessage', event))
})

Http.listen(3000, () => {
    console.log('Listening at :3000...');
});