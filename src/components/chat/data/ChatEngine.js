const Message = require("./Message");

class ChatEngine {
    constructor(user) {
        this.userConnected = user;
        this.messages = [];
    }

    index() {
        return this.messages;
    }

    show(id) {
        return this.messages.find(message => message.id === id);
    }

    store(data, receivedMessage = false) {
        let message;

        if(receivedMessage) {
            message = Message.createFromMessage(data)
        } else {
            message = new Message(data)
        }
        
        this.messages.push(message);

        return message;
    }

    update(id, attr, value) {
        let message = this.show(id);

        if(!message) return;

        message[attr] = value;
    }

    getMessageTime() {
        let date = new Date,
            hours = date.getHours(),
            minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        return `${hours}:${minutes}`;
    }
}

module.exports = ChatEngine;