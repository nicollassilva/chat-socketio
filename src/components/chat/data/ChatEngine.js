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

    store(data, receivedMessage = false, image = false, isWarning = false) {
        let id = Math.floor(Math.random() * 100000 + 1);

        this.messages.push({
            id: receivedMessage ? data.id : id,
            content: receivedMessage ? data.content : data,
            time: this.getMessageTime(),
            me: !receivedMessage,
            deleted: false,
            image,
            isWarning
        });

        return this.show(id);
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