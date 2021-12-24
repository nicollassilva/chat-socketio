// Server/SocketIO constants
const Express = require('express')();
const Http = require('http').Server(Express)
const IO = require('socket.io')(Http)

// Helper Functions
const Server = require('./functions/Server');

// Server Data
const Users = require('./system/Users');

IO.on('connection', socket => {
    socket.on('getSocketUserData', userData => {
        Server.userConnectedLog(userData, socket);

        let userDataGenerated = Users.newData(userData, socket);
        Users.store(userDataGenerated);

        socket.emit('userDataGenerated', userDataGenerated);
        IO.emit('userList', Users.index());
    })

    socket.on('disconnect', event => {
        let user = Users.show(socket.id);
        Server.userDisconnectLog(user, socket);
        Users.delete(socket.id);
        
        IO.emit('userDisconnected', user);
        IO.emit('userList', Users.index());
    })

    socket.on('sendPrivateMessage', event => socket.to(event.to).emit('receivePrivateMessage', event));
    socket.on('deleteMessage', event => socket.to(event.user).emit('deleteMessage', event));
    socket.on('sendImage', event => socket.to(event.to).emit('receiveImage', event));
})

Http.listen(3000, () => {
    console.log('Listening at :3000...');
});