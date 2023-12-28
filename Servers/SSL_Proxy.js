const express = require('express');
const https = require('https');
const Constants = require('../Constants');
const lib = require('../lib');

class ProxyServer {

    app = express();

    /**
     * @type {https.Server}
     */
    https_server;

    /**
     * @param {Function} onResolve 
     */
    async initialize(onResolve) {
        const options = {
            key: Constants.KeyPem,
            cert: Constants.CertPem
        };

        this.httpsServer = https.createServer(options, this.app);

        await this.setUp_Growtopia_info_request_reroute();

        this.httpsServer.listen(
            Constants.defaultProxyPort
            ,
            () => {
                console.log(`SSL_Proxy server running on port ${Constants.defaultProxyPort}`)
                onResolve();
            }
        );
    }

    async setUp_Growtopia_info_request_reroute() {
        const GT_info = await lib.fetch_GT_servers_info();

        let response_str = '';
        response_str += `server|${Constants.defaultProxyIP}\n`;
        response_str += `port|${Constants.defaultProxyPort}\n`;
        response_str += `type|1\n`;
        response_str += `#maint|Under mainteance.\n`;
        response_str += `beta_server|${Constants.defaultProxyIP}\n`;
        response_str += `beta_port|${Constants.defaultProxyPort}\n`;
        response_str += `beta_type|1\n`;
        response_str += `meta|ni.com\n`;
        response_str += `${GT_info.meta2}\n`;

        this.app.post(
            '/growtopia/server_data.php',
            (req, res) => {
                console.log("Received a '/growtopia/server_data.php' Post Request");
                res.type('text/html').send(response_str);
            }
        );

        this.app.get(
            '/growtopia/server_data.php'
            ,
            (req, res) => {
                console.log("Received a '/growtopia/server_data.php' Get Request");
                res.type('text/html').send(response_str);
            }
        );

        this.app.all(
            '*'
            ,
            (req, res) => {
                console.log(`Received an anonymous request on ${req.path}`);
            }
        )
    }

}

module.exports = new ProxyServer();