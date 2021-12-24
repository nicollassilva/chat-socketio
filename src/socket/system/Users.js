const Objects = require('../functions/Objects')

class Users {
    constructor() {
        this.connected = [];
    }

    index() {
        return this.connected;
    }

    show(id) {
        return this.connected.find(user => user.id == id);
    }

    store(user) {
        this.connected.push(user);

        return this.show(user.id);
    }

    delete(value, attr = 'socketId') {
        let newObject = Objects.removeByAttribute(
            this.connected, attr, value
        );

        if(newObject.success) {
            this.connected = newObject.object;
        }

        return newObject.success;
    }

    newData(userData, socket) {
        return {
            ...userData,
            socketId: socket.id,
            address: socket.handshake.address,
        };
    }
}

module.exports = new Users();