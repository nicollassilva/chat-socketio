module.exports = {
    userConnectedLog(user, socket) {
        console.log(`${user.name} conectou no chat! ID: ${socket.id}`);
    },

    userDisconnectLog(user, socket) {
        console.log(`${user && user.name ? user.name : 'Anônimo'} desconectou do chat! ID: ${socket.id}`);
    }
}