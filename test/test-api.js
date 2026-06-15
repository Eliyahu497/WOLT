const { spawn } = require('child_process');

console.log("--- STARTING API INTEGRATION TEST ---");

// 1. Start the server as a child process
const serverProcess = spawn('node', ['app.js']);

serverProcess.stdout.on('data', (data) => {
    console.log(`[Server Logs]: ${data.toString().trim()}`);
});

serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error]: ${data.toString().trim()}`);
});

// Helper function to sleep/wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    // Give the server 1 second to start and bind to the port
    await sleep(1000);

    const baseUrl = 'http://localhost:1234/api/orders';
    const userIdHeader = { 
        'x-user-id': 'user_shira', 
        'Content-Type': 'application/json' 
    };

    let createdOrderId = null;

    try {
        // Seed user via API
        console.log("Seeding test user...");
        const userRes = await fetch('http://localhost:1234/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Shira",
                email: "shira@example.com",
                phone: "0501234567",
                location: { lat: 32.0, lng: 34.0 },
                userName: "shira_user",
                password: "password123",
                avatar: "http://example.com/avatar.jpg"
            })
        });
        if (userRes.status !== 201) {
            throw new Error(`Failed to seed user, status: ${userRes.status}`);
        }
        const locationHeader = userRes.headers.get('Location');
        const userId = locationHeader.split('/').pop();
        userIdHeader['x-user-id'] = userId;
        console.log(`✅ Created User with ID: ${userId}`);

        // Seed restaurant via API
        console.log("Seeding test restaurant...");
        const restRes = await fetch('http://localhost:1234/api/restaurants', {
            method: 'POST',
            headers: userIdHeader,
            body: JSON.stringify({ name: "Giraffe", description: "Asian noodle bar", location: { lat: 32.0, lng: 34.0 }, image: "http://example.com/giraffe.jpg" })
        });
        if (restRes.status !== 201) {
            throw new Error(`Failed to seed restaurant, status: ${restRes.status}`);
        }
        const locationHeaderRest = restRes.headers.get('Location');
        const restId = locationHeaderRest.split('/').pop();
        console.log(`✅ Created Restaurant with ID: ${restId}`);

        // Seed product via API
        console.log("Seeding test product...");
        const prodRes = await fetch(`http://localhost:1234/api/restaurants/${restId}/products`, {
            method: 'POST',
            headers: userIdHeader,
            body: JSON.stringify({ name: "Sushi", description: "Maki rolls", price: 65, image: "http://example.com/sushi.jpg" })
        });
        if (prodRes.status !== 201) {
            const errText = await prodRes.text();
            throw new Error(`Failed to seed product, status: ${prodRes.status}, body: ${errText}`);
        }
        const locationHeaderProd = prodRes.headers.get('Location');
        if (!locationHeaderProd) {
            throw new Error("Missing Location header in product creation response");
        }
        const prodId = locationHeaderProd.split('/').pop();
        console.log(`✅ Created Product with ID: ${prodId}`);

        // --- 1. Test POST /api/orders (Create Order) ---
        console.log("\n1. Testing POST /api/orders (Create Order)...");
        const createRes = await fetch(baseUrl, {
            method: 'POST',
            headers: userIdHeader,
            body: JSON.stringify({
                restaurantId: restId,
                items: [{ productId: prodId, quantity: 3 }]
            })
        });

        if (createRes.status !== 201) {
            throw new Error(`Expected 201 status, got ${createRes.status}`);
        }
        const createdOrder = await createRes.json();
        console.log("✅ Success! Created Order:", createdOrder);
        console.log(`   Calculated Price (65 * 3): ${createdOrder.total} NIS`);
        createdOrderId = createdOrder.id;

        // --- 2. Test GET /api/orders (Get User Orders) ---
        console.log("\n2. Testing GET /api/orders (User History)...");
        const historyRes = await fetch(baseUrl, {
            method: 'GET',
            headers: userIdHeader
        });
        if (historyRes.status !== 200) {
            throw new Error(`Expected 200 status, got ${historyRes.status}`);
        }
        const history = await historyRes.json();
        console.log(`✅ Success! Found ${history.length} orders in history.`);

        // --- 3. Test GET /api/orders/:id (Get Specific Order) ---
        console.log(`\n3. Testing GET /api/orders/${createdOrderId} (Order Details)...`);
        const detailsRes = await fetch(`${baseUrl}/${createdOrderId}`, {
            method: 'GET',
            headers: userIdHeader
        });
        if (detailsRes.status !== 200) {
            throw new Error(`Expected 200 status, got ${detailsRes.status}`);
        }
        const details = await detailsRes.json();
        console.log("✅ Success! Order details retrieved:", details);

        // --- 4. Test PATCH /api/orders/:id (Update Order Items) ---
        console.log(`\n4. Testing PATCH /api/orders/${createdOrderId} (Update Items)...`);
        const patchRes = await fetch(`${baseUrl}/${createdOrderId}`, {
            method: 'PATCH',
            headers: userIdHeader,
            body: JSON.stringify({
                items: [{ productId: prodId, quantity: 3 }]
            })
        });
        if (patchRes.status !== 204) {
            throw new Error(`Expected 204 status, got ${patchRes.status}`);
        }
        console.log("✅ Success! Items updated (204 No Content).");

        // Verify total price and items were indeed updated
        const verifyRes = await fetch(`${baseUrl}/${createdOrderId}`, {
            method: 'GET',
            headers: userIdHeader
        });
        const verifiedOrder = await verifyRes.json();
        console.log(`   Verification: New Total is now '${verifiedOrder.total}' NIS (was ${details.total} NIS)`);

        // --- 5. Test DELETE /api/orders/:id (Cancel Order) ---
        console.log(`\n5. Testing DELETE /api/orders/${createdOrderId} (Delete Order)...`);
        const deleteRes = await fetch(`${baseUrl}/${createdOrderId}`, {
            method: 'DELETE',
            headers: userIdHeader
        });
        if (deleteRes.status !== 204) {
            throw new Error(`Expected 204 status, got ${deleteRes.status}`);
        }
        console.log("✅ Success! Order deleted/canceled (204 No Content).");

        // Verify it was deleted (should return 404)
        console.log("\n6. Verification of deletion...");
        const verifyDeleteRes = await fetch(`${baseUrl}/${createdOrderId}`, {
            method: 'GET',
            headers: userIdHeader
        });
        if (verifyDeleteRes.status === 404) {
            console.log("✅ Success! Order is no longer found (404 Not Found).");
        } else {
            throw new Error(`Expected 404 status after deletion, got ${verifyDeleteRes.status}`);
        }

    } catch (err) {
        console.error("\n❌ Test Failed with error:", err.message);
    } finally {
        console.log("\nShutting down server...");
        serverProcess.kill();
    }
}

runTests();
