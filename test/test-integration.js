const net = require('net');
const { spawn } = require('child_process');

console.log("--- STARTING END-TO-END TCP & API INTEGRATION TEST ---");

const TCP_PORT = 5000;
let tcpReceivedData = null;

// 1. Spin up a temporary Mock TCP Server to mimic the C++ backend
const mockCppServer = net.createServer((socket) => {
    console.log("[Mock C++ Server] Node.js TCP Client connected!");

    socket.on('data', (data) => {
        tcpReceivedData = data.toString();
        console.log(`[Mock C++ Server] Received payload: '${tcpReceivedData.trim()}'`);

        // Respond with success (C++ server status code for PATCH success is usually "204 No Content")
        socket.write("204 No Content\n");
    });
});

// Start Mock TCP Server listening on port 5000
mockCppServer.listen(TCP_PORT, () => {
    console.log(`[Mock C++ Server] Listening on port ${TCP_PORT}...`);

    // 2. Start the Node.js Express Web Server
    const serverProcess = spawn('node', ['app.js']);

    serverProcess.stdout.on('data', (data) => {
        console.log(`[Web Server Logs]: ${data.toString().trim()}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`[Web Server Error]: ${data.toString().trim()}`);
    });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function runTest() {
        // Wait 1 second for the web server to start up and bind to port 1234
        await sleep(1000);

        const baseUrl = 'http://localhost:1234/api';

        try {
            // Seed a restaurant via POST
            console.log("\n1. Seeding test restaurant...");
            const restRes = await fetch(`${baseUrl}/restaurants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "Giraffe", description: "Asian noodle bar" })
            });
            const restaurant = await restRes.json();
            const restId = restaurant.id;

            // Seed a product under that restaurant via POST
            console.log("2. Seeding test product...");
            const prodRes = await fetch(`${baseUrl}/restaurants/${restId}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "Sushi", description: "Maki rolls", price: 65 })
            });
            const product = await prodRes.json();
            const prodId = product.id;

            // Trigger GET on the product with X-User-ID header
            console.log(`\n3. Fetching product details for product ${prodId}...`);
            const getRes = await fetch(`${baseUrl}/restaurants/${restId}/products/${prodId}`, {
                method: 'GET',
                headers: {
                    'x-user-id': 'user_shira',
                    'Content-Type': 'application/json'
                }
            });

            if (getRes.status !== 200) {
                throw new Error(`Expected 200 OK from product GET request, got status: ${getRes.status}`);
            }

            const getProductData = await getRes.json();
            console.log("✅ Success! Web Server returned product details:", getProductData);

            // Wait a brief moment for TCP communication to complete
            await sleep(500);

            // Verify that the Mock C++ server received the expected PATCH command
            console.log("\n4. Verifying TCP Command received by C++ server...");
            const expectedPayload = `PATCH user_shira ${prodId}\n`;

            if (tcpReceivedData === expectedPayload) {
                console.log(`✅ Success! Mock C++ server received correct payload: '${tcpReceivedData.trim()}'`);
                console.log("\n🎉 WOLT-83 INTEGRATION TEST PASSED SUCCESSFULLY! 🎉");
            } else {
                throw new Error(`Payload mismatch.\nExpected: '${expectedPayload.trim()}'\nReceived: '${tcpReceivedData ? tcpReceivedData.trim() : 'null'}'`);
            }

        } catch (error) {
            console.error("\n❌ Integration Test Failed:", error.message);
            process.exitCode = 1;
        } finally {
            // Shut down both processes gracefully
            console.log("\nCleaning up processes...");
            serverProcess.kill();
            mockCppServer.close();
        }
    }

    runTest();
});
