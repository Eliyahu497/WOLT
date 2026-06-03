const net = require('net');

class TCPClient {
    // Setting default host and port. This can be configured dynamically using environment variables
    // (e.g. for Docker networks) or fall back to localhost:5555.
    constructor(
        host = process.env.TCP_HOST || 'localhost',
        port = process.env.TCP_PORT ? Number(process.env.TCP_PORT) : 5555
    ) {
        this.host = host;
        this.port = port;
    }

    // Send a raw command string to the C++ server over a TCP socket
    sendTCPCommand(command) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            // Establish connection to the C++ RecommenderServer
            client.connect(this.port, this.host, () => {
                console.log(`[TCP Client] Connected to C++ RecommenderServer at ${this.host}:${this.port}`);
                client.write(command + '\n');
            });

            // Handle response data
            client.on('data', (data) => {
                const responseStr = data.toString().trim();
                console.log(`[TCP Client] Received response from C++ server: ${responseStr}`);
                client.destroy(); // Gracefully close socket
                resolve(responseStr);
            });

            // Handle connection errors
            client.on('error', (err) => {
                console.error(`[TCP Client] Socket error: ${err.message}`);
                reject(err);
            });
        });
    }

    // Reports one or more product IDs (either single ID string/number or an array of IDs) to the C++ server.
    // If the user already exists, it uses PATCH. If not, it falls back to POST.
    async reportInteraction(userId, products) {
        if (!products) return;
        const productsStr = Array.isArray(products) ? products.join(' ') : String(products).trim();
        if (!productsStr) return;
        try {
            // Try PATCH first
            const response = await this.sendTCPCommand(`PATCH ${userId} ${productsStr}`);
            if (response.includes("404")) {
                // User does not exist yet, fall back to POST to initialize user profile
                return await this.sendTCPCommand(`POST ${userId} ${productsStr}`);
            }
            return response;
        } catch (err) {
            console.error(`[TCP Client Error] Failed to report interaction: ${err.message}`);
            throw err;
        }
    }

    // Removes specified product IDs from the user's history on the C++ server.
    async removePurchase(userId, productIds) {
        if (!productIds || productIds.length === 0) return;
        const productsStr = productIds.join(' ');
        try {
            return await this.sendTCPCommand(`DELETE ${userId} ${productsStr}`);
        } catch (err) {
            console.error(`[TCP Client Error] Failed to remove purchase: ${err.message}`);
            throw err;
        }
    }
}

// Export a singleton instance of the network client
module.exports = new TCPClient();