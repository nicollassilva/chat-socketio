// Server/SocketIO constants
const Express = require('express')();
const Http = require('http').Server(Express)
const Socketio = require('socket.io')(Http)

// Functions
const Server = require('./functions/Server');

// Data Server
const Users = require('./system/Users');

Socketio.on('connection', socket => {
    socket.on('userConnected', event => {
        Server.userConnectedLog(event, socket);

        let myData = Users.newData(event, socket);
        Users.store(myData);

        socket.emit('myData', myData);
        Socketio.emit('connected', Users.index());
    })

    socket.on('disconnect', event => {
        let user = Users.show(socket.id);
        Server.userDisconnectLog(user, socket);
        Users.delete(socket.id);
        
        Socketio.emit('userDisconnected', user);
    })

    socket.on('sendPrivateMessage', event => socket.to(event.to).emit('receivePrivateMessage', event));
})

Http.listen(3000, () => {
    console.log('Listening at :3000...');
});