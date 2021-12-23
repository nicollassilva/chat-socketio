class Message {
    constructor(user, message) {
        this._id = Math.floor(Math.random() * 100000);
        this._userSent;
        this._type;
        this._content;

        this._deleted = false;
    }

    getUser() {
        return this._userSent;
    }

    setType(type) {
        this._type = type;
    }

    getId() {
        return this._id;
    }

    getType() {
        return this._type;
    }

    getMessage() {
        return this._content;
    }

    isDeleted() {
        return this._deleted;
    }
}

module.exports = Message