class ServerHandler {

    SSL_server = require('./Servers/SSL_Proxy');

    async initialize_SSL_server() {
        return new Promise((resolve) => this.SSL_server.initialize(resolve))
    }

}

module.exports = new ServerHandler();