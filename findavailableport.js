const net = require('net');

function findAvailablePort(startPort, endPort, callback) {
    const portRange = endPort - startPort + 1;
    let currentPort = startPort;

    function checkPort(port) {
        const server = net.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                // Port is in use, try the next one
                server.close();
                checkPort(port + 1);
            } else {
                // Other error occurred, notify the callback
                callback(err);
            }
        });
        server.once('listening', () => {
            // Port is available, close the server and return the port
            server.close();
            callback(null, port);
        });
        server.listen(port);
    }

    checkPort(startPort);
}

// Example usage:
findAvailablePort(3000, 4000, (err, port) => {
    if (err) {
        console.error('Error finding available port:', err);
    } else {
        console.log('Available port:', port);
    }
});
