const IOClient = require('socket.io-client');
const User = require('../core/User')

class Socket {
    constructor(ioClient) {
        this._socket = ioClient

        this.listening()
    }

    static create(url) {
        let ioClient = IOClient(url, { transports: ['websocket'] })

        return new Socket(ioClient)
    }

    emit(eventName, callback) {
        this._socket.emit(eventName, callback)
    }

    listening() {
        // Quando o socket envia os dados do usuário que acabou de logar
        this._socket.on('userDataGenerated', userDataUpdated => {
            window.user = User.createFromSocketData(userDataUpdated)

            window.chatEventBus.$emit('userDataUpdated')
        });

        // Quando conecta um usuário, o socket emite um evento local para atualizar a lista de usuários logados
        this._socket.on('userList', userList => {
            window.chatEventBus.$emit('userList', userList.reverse())
        })

        this._socket.on('userDesconnected', userObject => {
            window.chatEventBus.$emit('userDesconnected', userObject)
        })
    }
}

module.exports = Socket