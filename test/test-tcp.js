const net = require('net');
const tcpClient = require('../services/TCPClient');

console.log("--- STARTING TCP SOCKET INTEGRATION TEST ---");

const TEST_PORT = 5555;

// 1. Spin up a temporary Mock TCP Server to mimic your C++ backend
const mockCppServer = net.createServer((socket) => {
    console.log("[Mock C++ Server] Node.js app just connected to me!");
    
    socket.on('data', (data) => {
        console.log(`[Mock C++ Server] I just received this command: '${data.toString().trim()}'`);
        // Send back a success confirmation message
        socket.write("204 No Content\n");
    });
});

// Start listening on port 5000
mockCppServer.listen(TEST_PORT, async () => {
    console.log(`[Mock C++ Server] Listening on port ${TEST_PORT}...`);

    // 2. Trigger your actual TCPClient to make the connection call
    try {
        console.log("\nTriggering reportInteraction()...");
        const serverResponse = await tcpClient.reportInteraction("shira_123", "item_sushi_99");
        console.log(`\n✅ Integration Test Passed! Final parsed output: ${serverResponse}`);
    } catch (error) {
        console.error("\n❌ Integration Test Failed:", error.message);
    } finally {
        // Shut down the temporary mock server so the terminal process can exit nicely
        mockCppServer.close();
    }
});