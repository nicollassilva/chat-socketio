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

    store(data, isObject = false) {
        let id = Math.floor(Math.random() * 100000 + 1);

        this.messages.push({
            id: isObject ? data.id : id,
            content: isObject ? data.content : data,
            time: this.getMessageTime(),
            me: !isObject,
            deleted: false
        });

        return this.show(id);
    }

    getMessageTime() {
        let date = new Date,
            hours = date.getHours(),
            minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        return `${hours}:${minutes}`;
    }
}

module.exports = ChatEngine;