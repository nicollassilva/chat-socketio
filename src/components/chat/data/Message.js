class Message {
    constructor(data = {}) {
        this._type;
        this._owner;
        this._content;
        this._sendingUser;
        this._time = this.getTime()
        this._id = this.generateId()
        
        this._warning = false
        this._deleted = false;

        this.buildFromData(data)
    }

    generateId() {
        return Math.floor(Math.random() * 100000)
    }

    buildFromData(data) {
        if(data.id) {
            this.setId(data.id)
        }

        this.setType(data.type)
        this.setContent(data.content)
        this.setsendingUser(data.sendingUser)

        this.resolveOwner()
    }

    static createFromMessage(data) {
        return Message(data)
    }

    resolveOwner() {
        if(!this.sendingUser()) {
            this.setOwner(false)
            return
        }

        if(this.sendingUser().name == window.chatEventBus.user.name) {
            this.setOwner(true)
            return
        }

        this.setOwner(false)
    }

    sendingUser() {
        return this._sendingUser;
    }

    id() {
        return this._id;
    }

    type() {
        return this._type;
    }

    content() {
        return this._content;
    }

    isDeleted() {
        return this._deleted;
    }

    setType(type) {
        this._type = type;
    }

    setId(id) {
        this._id = id;
    }

    setContent(content) {
        this._content = content
    }

    setSendingUser(user) {
        this._sendingUser = user
    }

    setOwner(isOwner) {
        this._owner = isOwner
    }

    getTime() {
        let date = new Date,
            hours = date.getHours(),
            minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        return `${hours}:${minutes}`;
    }
}

module.exports = Message