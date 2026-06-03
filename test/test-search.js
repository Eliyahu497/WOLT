const { spawn } = require('child_process');

console.log("--- STARTING SEARCH API INTEGRATION TEST ---");

// Start the server as a child process
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
    // Give the server 1 second to start and bind to the port (1234)
    await sleep(1000);

    const baseUrl = 'http://localhost:1234/api';

    try {
        // Register a test user
        console.log("Registering test user...");
        const userRes = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Search Tester",
                email: "search@example.com",
                phone: "0547777777",
                address: "Search Ave 1",
                userName: "search_tester",
                password: "password123"
            })
        });
        if (userRes.status !== 201) {
            const errText = await userRes.text();
            throw new Error(`Failed to register user. Status: ${userRes.status}, Body: ${errText}`);
        }
        const userLocation = userRes.headers.get('Location');
        const userId = userLocation.split('/').pop();
        console.log(`✅ User registered successfully. ID: ${userId}`);

        const authHeaders = {
            'Content-Type': 'application/json',
            'x-user-id': userId
        };

        // 1. Seed Restaurant 1 via POST /api/restaurants
        console.log("\nSeeding Restaurant: 'Pizza Hut'...");
        const restRes1 = await fetch(`${baseUrl}/restaurants`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: "Pizza Hut",
                description: "Great Italian Pizza and Pasta"
            })
        });
        if (restRes1.status !== 201) {
            throw new Error(`Failed to seed restaurant, status: ${restRes1.status}`);
        }
        const restLocation1 = restRes1.headers.get('Location');
        const restId1 = restLocation1.split('/').pop();
        console.log(`✅ Created Restaurant: Pizza Hut (ID: ${restId1})`);

        // Seed Product 1 under Restaurant 1 via POST /api/restaurants/:id/products
        console.log("Seeding Product: 'Pepperoni Pizza'...");
        const prodRes1 = await fetch(`${baseUrl}/restaurants/${restId1}/products`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: "Pepperoni Pizza",
                description: "Hot cheesy pizza with pepperoni slices",
                price: 60
            })
        });
        if (prodRes1.status !== 201) {
            throw new Error(`Failed to seed product, status: ${prodRes1.status}`);
        }
        const prodLocation1 = prodRes1.headers.get('Location');
        const prodId1 = prodLocation1.split('/').pop();
        const product1 = { id: prodId1, name: "Pepperoni Pizza" };
        console.log(`✅ Created Product: ${product1.name} (ID: ${product1.id})`);

        // Seed Product 2 under Restaurant 1
        console.log("Seeding Product: 'Garlic Bread'...");
        const prodRes2 = await fetch(`${baseUrl}/restaurants/${restId1}/products`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: "Garlic Bread",
                description: "Toasted bread with garlic butter",
                price: 20
            })
        });
        if (prodRes2.status !== 201) {
            throw new Error(`Failed to seed product, status: ${prodRes2.status}`);
        }
        const prodLocation2 = prodRes2.headers.get('Location');
        const prodId2 = prodLocation2.split('/').pop();
        const product2 = { id: prodId2, name: "Garlic Bread" };
        console.log(`✅ Created Product: ${product2.name} (ID: ${product2.id})`);


        // 2. Seed Restaurant 2 via POST /api/restaurants
        console.log("\nSeeding Restaurant: 'Sushi Bar'...");
        const restRes2 = await fetch(`${baseUrl}/restaurants`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: "Sushi Bar",
                description: "Authentic Japanese sushi and rolls"
            })
        });
        if (restRes2.status !== 201) {
            throw new Error(`Failed to seed restaurant, status: ${restRes2.status}`);
        }
        const restLocation2 = restRes2.headers.get('Location');
        const restId2 = restLocation2.split('/').pop();
        console.log(`✅ Created Restaurant: Sushi Bar (ID: ${restId2})`);

        // Seed Product 3 under Restaurant 2
        console.log("Seeding Product: 'Veggie Roll'...");
        const prodRes3 = await fetch(`${baseUrl}/restaurants/${restId2}/products`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: "Veggie Roll",
                description: "Fresh cucumber and avocado roll",
                price: 35
            })
        });
        if (prodRes3.status !== 201) {
            throw new Error(`Failed to seed product, status: ${prodRes3.status}`);
        }
        const prodLocation3 = prodRes3.headers.get('Location');
        const prodId3 = prodLocation3.split('/').pop();
        const product3 = { id: prodId3, name: "Veggie Roll" };
        console.log(`✅ Created Product: ${product3.name} (ID: ${product3.id})`);


        // --- Test Case 1: Search for "pizza" (should match Pizza Hut restaurant and Pepperoni Pizza product) ---
        console.log("\n3. Testing GET /api/search/pizza (case-insensitive query)...");
        const res1 = await fetch(`${baseUrl}/search/pizza`);
        if (res1.status !== 200) {
            throw new Error(`Expected 200 status, got ${res1.status}`);
        }
        const data1 = await res1.json();
        console.log("✅ Success! Search for 'pizza' returned:", JSON.stringify(data1, null, 2));

        // Verifications
        const hasPizzaHut = data1.restaurants.some(r => r.id === restId1);
        const hasPepperoni = data1.products.some(p => p.id === product1.id);
        if (!hasPizzaHut || !hasPepperoni) {
            throw new Error("Expected to find Pizza Hut restaurant and Pepperoni Pizza product!");
        }
        console.log("👉 Verified: Correctly found matching restaurant and product.");

        // --- Test Case 2: Search for "roll" (should match Veggie Roll product) ---
        console.log("\n4. Testing GET /api/search/roll...");
        const res2 = await fetch(`${baseUrl}/search/roll`);
        if (res2.status !== 200) {
            throw new Error(`Expected 200 status, got ${res2.status}`);
        }
        const data2 = await res2.json();
        console.log("✅ Success! Search for 'roll' returned:", JSON.stringify(data2, null, 2));

        const hasVeggieRoll = data2.products.some(p => p.id === product3.id);
        const hasSushiBar = data2.restaurants.some(r => r.id === restId2);
        if (!hasVeggieRoll || !hasSushiBar) {
            throw new Error("Expected to find Veggie Roll product and Sushi Bar restaurant!");
        }
        console.log("👉 Verified: Correctly found matching restaurant and product.");

        // --- Test Case 3: Search for "nonexistent" (should return empty arrays) ---
        console.log("\n5. Testing GET /api/search/nonexistent...");
        const res3 = await fetch(`${baseUrl}/search/nonexistent`);
        if (res3.status !== 200) {
            throw new Error(`Expected 200 status, got ${res3.status}`);
        }
        const data3 = await res3.json();
        console.log("✅ Success! Search for 'nonexistent' returned:", JSON.stringify(data3, null, 2));
        if (data3.restaurants.length !== 0 || data3.products.length !== 0) {
            throw new Error("Expected search for 'nonexistent' to return empty results!");
        }
        console.log("👉 Verified: Correctly returned empty arrays.");

        // --- Test Case 4: Search for empty/spaces query (should return 400 Bad Request) ---
        console.log("\n6. Testing GET /api/search/   (spaces query)...");
        const res4 = await fetch(`${baseUrl}/search/%20%20%20`); // URL encoded spaces
        if (res4.status === 400) {
            const errorData = await res4.json();
            console.log("✅ Success! Empty query correctly returned 400 Bad Request:", errorData);
        } else {
            throw new Error(`Expected 400 status for spaces query, got ${res4.status}`);
        }

        console.log("\n🎉 ALL SEARCH API TESTS PASSED SUCCESSFULLY! 🎉");

    } catch (err) {
        console.error("\n❌ Search Test Failed with error:", err.message);
        process.exitCode = 1;
    } finally {
        console.log("\nShutting down server...");
        serverProcess.kill();
    }
}

runTests();
