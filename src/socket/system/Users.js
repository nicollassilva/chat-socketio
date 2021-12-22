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

    delete(value, attr = 'id') {
        let newObject = Objects.removeByAttribute(
            this.connected, attr, value
        );

        if(newObject.success) {
            this.connected = newObject.object;
        }

        return newObject.success;
    }

    newData(name, socket) {
        return {
            id: socket.id,
            name,
            address: socket.handshake.address,
            disconnected: false
        };
    }
}

module.exports = new Users();