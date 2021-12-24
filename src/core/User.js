class User {
    constructor(data) {
        this._ip;
        this._name;
        this._socketId;
        this._status = 'online'
        this._disconnected = false
        this._id = this.generateId()
        this._connectedTo = this.getCompleteTime()

        this.buildFromData(data)
    }

    buildFromData(data) {
        if(data.name) {
            this.setName(data.name)
        }
    }

    generateId() {
        return Math.floor(Math.random() * 100000)
    }

    static create(data = {}) {
        return new User(data.name)
    }

    static createFromSocketData(data) {
        let user = new User({})

        user.setIp(data.adress)
        user.setName(data._name)
        user.setSocketId(data.socketId)

        return user
    }

    setStatus(status) {
        let allowedStatus = ['online', 'busy', 'offline', 'away']

        if(!allowedStatus.includes(status)) return

        this._status = allowedStatus
    }

    setIp(ip) {
        this._ip = ip

        return this
    }

    setName(name) {
        this._name = name

        return this
    }

    setSocketId(socketId) {
        this._socketId = socketId

        return this
    }

    disconnect() {
        this._disconnected = true
    }

    id() {
        return this._id
    }

    ip() {
        return this._ip
    }

    name() {
        return this._name
    }

    socketId() {
        return this._socketId
    }

    isDisconnected() {
        return this._disconnected
    }

    getCompleteTime() {
        let date = new Date,
            day = date.getDay(),
            month = date.getMonth(),
            hours = date.getHours(),
            minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        return `${day}/${month} ${hours}:${minutes}`;
    }
}

module.exports = User