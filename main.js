
const lib = require('./lib');

const server_handler = require('./ServerHandler');

async function main() {
    const isElevated = lib.isAdmin();
    if (!isElevated) { console.log('Process does not have admin privileges, exiting...'); process.exit(); }

    lib.growtopiaReroute(false);

    await server_handler.initialize_SSL_server();

}
main();