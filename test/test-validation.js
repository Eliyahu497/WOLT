const { spawn } = require('child_process');

console.log("--- STARTING ORDER CREATION VALIDATION TEST ---");

// Start the server as a child process
const serverProcess = spawn('node', ['app.js']);

serverProcess.stdout.on('data', (data) => {
    // Suppress logs unless needed for debug
});

serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error]: ${data.toString().trim()}`);
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    // Wait 1 second for the server to start on port 1234
    await sleep(1000);

    const baseUrl = 'http://localhost:1234/api';
    const userIdHeader = {
        'x-user-id': 'user_shira',
        'Content-Type': 'application/json'
    };

    let testCount = 0;
    let passedCount = 0;

    async function testPost(description, payload, expectedStatus, expectedErrorSubstr) {
        testCount++;
        try {
            console.log(`\nTest ${testCount}: ${description}`);
            const res = await fetch(`${baseUrl}/orders`, {
                method: 'POST',
                headers: userIdHeader,
                body: JSON.stringify(payload)
            });

            if (res.status !== expectedStatus) {
                throw new Error(`Expected status ${expectedStatus}, got ${res.status}`);
            }

            const data = await res.json();
            if (expectedStatus === 400) {
                if (!data.error) {
                    throw new Error(`Expected error payload, got: ${JSON.stringify(data)}`);
                }
                if (!data.error.toLowerCase().includes(expectedErrorSubstr.toLowerCase())) {
                    throw new Error(`Expected error to contain '${expectedErrorSubstr}', got: '${data.error}'`);
                }
                console.log(`✅ Passed! Status: 400. Error message correctly returned: "${data.error}"`);
            } else {
                console.log(`✅ Passed! Status: ${expectedStatus}. Order created successfully.`);
            }
            passedCount++;
        } catch (err) {
            console.error(`❌ Failed: ${err.message}`);
        }
    }

    try {
        // Register a test user first so they exist in DB
        console.log("Registering test user...");
        const userRes = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Shira",
                email: "shira@example.com",
                phone: "0541234567",
                address: "Dizengoff 100",
                userName: "shira_val",
                password: "password123"
            })
        });
        if (userRes.status !== 201) {
            const errText = await userRes.text();
            throw new Error(`Failed to register user. Status: ${userRes.status}, Body: ${errText}`);
        }
        const userLocation = userRes.headers.get('Location');
        const userId = userLocation.split('/').pop();
        userIdHeader['x-user-id'] = userId;
        console.log(`✅ User registered successfully. ID: ${userId}`);

        // --- Setup: Add a valid restaurant via API so we can order from it ---
        console.log("Seeding restaurant 'Validation Diner'...");
        const restRes = await fetch(`${baseUrl}/restaurants`, {
            method: 'POST',
            headers: userIdHeader,
            body: JSON.stringify({ name: "Validation Diner", description: "Safe foods only" })
        });
        if (restRes.status !== 201) {
            throw new Error(`Failed to seed restaurant, status: ${restRes.status}`);
        }
        const restLocation = restRes.headers.get('Location');
        const validRestId = restLocation.split('/').pop();
        console.log(`✅ Created Restaurant (ID: ${validRestId})`);

        // Add a valid product to this restaurant
        console.log("Seeding product 'Salad'...");
        const prodRes = await fetch(`${baseUrl}/restaurants/${validRestId}/products`, {
            method: 'POST',
            headers: userIdHeader,
            body: JSON.stringify({ name: "Salad", description: "Healthy greens", price: 40 })
        });
        if (prodRes.status !== 201) {
            throw new Error(`Failed to seed product, status: ${prodRes.status}`);
        }
        const prodLocation = prodRes.headers.get('Location');
        const validProdId = prodLocation.split('/').pop();
        console.log(`✅ Created Product (ID: ${validProdId})`);


        // --- Test 1: Valid payload (should succeed) ---
        await testPost(
            "Valid payload",
            { restaurantId: validRestId, items: [{ productId: validProdId, quantity: 2 }] },
            201
        );

        // --- Test 2: Missing restaurantId ---
        await testPost(
            "Missing restaurantId",
            { items: [{ productId: validProdId, quantity: 2 }] },
            400,
            "Restaurant ID is required"
        );

        // --- Test 3: Empty restaurantId ---
        await testPost(
            "Empty restaurantId",
            { restaurantId: "   ", items: [{ productId: validProdId, quantity: 2 }] },
            400,
            "Restaurant ID is required"
        );

        // --- Test 4: Restaurant not found ---
        await testPost(
            "Restaurant not found in DB",
            { restaurantId: "rest_nonexistent_123", items: [{ productId: validProdId, quantity: 2 }] },
            400,
            "Restaurant not found"
        );

        // --- Test 5: Missing items array ---
        await testPost(
            "Missing items list",
            { restaurantId: validRestId },
            400,
            "Order must contain at least one item"
        );

        // --- Test 6: Empty items array ---
        await testPost(
            "Empty items list",
            { restaurantId: validRestId, items: [] },
            400,
            "Order must contain at least one item"
        );

        // --- Test 7: Missing productId inside items ---
        await testPost(
            "Missing product ID in item object",
            { restaurantId: validRestId, items: [{ quantity: 2 }] },
            400,
            "Product ID is required for all items"
        );

        // --- Test 8: Non-existent productId ---
        await testPost(
            "Product not found in restaurant's menu",
            { restaurantId: validRestId, items: [{ productId: "prod_nonexistent_99", quantity: 2 }] },
            400,
            "not found in restaurant"
        );

        // --- Test 9: Zero quantity ---
        await testPost(
            "Zero quantity",
            { restaurantId: validRestId, items: [{ productId: validProdId, quantity: 0 }] },
            400,
            "must be a positive integer"
        );

        // --- Test 10: Negative quantity ---
        await testPost(
            "Negative quantity",
            { restaurantId: validRestId, items: [{ productId: validProdId, quantity: -5 }] },
            400,
            "must be a positive integer"
        );

        // --- Test 11: Non-numeric quantity ---
        await testPost(
            "Non-numeric quantity string",
            { restaurantId: validRestId, items: [{ productId: validProdId, quantity: "three" }] },
            400,
            "must be a positive integer"
        );

        // --- Test 12: Decimal quantity ---
        await testPost(
            "Decimal quantity",
            { restaurantId: validRestId, items: [{ productId: validProdId, quantity: 1.5 }] },
            400,
            "must be a positive integer"
        );


        console.log(`\n--- RESULTS: ${passedCount}/${testCount} tests passed ---`);
        if (passedCount !== testCount) {
            throw new Error(`${testCount - passedCount} test(s) failed!`);
        }
        console.log("🎉 ALL ORDER CREATION VALIDATION TESTS PASSED! 🎉");

    } catch (err) {
        console.error("\n❌ Validation Test Suite failed:", err.message);
        process.exitCode = 1;
    } finally {
        console.log("\nShutting down server...");
        serverProcess.kill();
    }
}

runTests();
