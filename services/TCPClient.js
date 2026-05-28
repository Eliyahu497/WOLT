const net = require('net');

class TCPClient {
    // Setting default host and port. This can be configured dynamically using environment variables
    // (e.g. for Docker networks) or fall back to localhost:5000.
    constructor(
        host = process.env.TCP_HOST || 'localhost',
        port = process.env.TCP_PORT ? Number(process.env.TCP_PORT) : 5000
    ) {
        this.host = host;
        this.port = port;
    }

    // Open socket, send request to C++ server, parse response, and close.
    addProductView(userId, productId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            // Establish connection to the C++ server
            client.connect(this.port, this.host, () => {
                console.log(`[TCP Client] Connected to C++ RecommenderServer at ${this.host}:${this.port}`);
                
                // Construct the command payload matching the C++ command protocol:
                // Command syntax: PATCH [userid] [productid]
                // (e.g., "PATCH user_shira prod_sushi")
                const payload = `PATCH ${userId} ${productId}\n`;                
                
                // Write the command over the TCP socket to the C++ server
                client.write(payload);
            });

            // Handle the response data coming back from the C++ server
            client.on('data', (data) => {
                const responseStr = data.toString().trim();
                console.log(`[TCP Client] Received response from C++ server: ${responseStr}`);
                
                client.destroy(); // Gracefully close the socket connection immediately
                resolve(responseStr);
            });

            // Catch any networking errors (e.g., C++ server is offline)
            client.on('error', (err) => {
                console.error(`[TCP Client] Socket error: ${err.message}`);
                reject(err);
            });
        });
    }
}

// Export a singleton instance of the network client
module.exports = new TCPClient();