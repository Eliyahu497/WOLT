const InMemoryDB = require('../InMemoryDB');
const userService = require('../services/UserService');

console.log("--- STARTING USER SERVICE LOCAL TEST ---");

try {
    console.log("Current Users in DB before tests:", InMemoryDB.users.length);

    // 1. Test User Creation (Register)
    const newUserData = {
        name: "Yossi Cohen",
        email: "yossi@example.com",
        phone: "0501234567",
        location: { lat: 32.0, lng: 34.0 },
        userName: "yossi_c",
        password: "secretPassword123",
        avatar: "http://example.com/avatar.jpg"
    };
    
    console.log("\n⏳ Attempting to create user...");
    const myUser = userService.createUser(newUserData);
    
    console.log("✅ Success! User Created:");
    console.log(myUser);
    console.log(`Current Users in DB after creation: ${InMemoryDB.users.length}`);

    // 2. Test invalidUN (Checking if username is taken)
    console.log("\n🔍 Testing Username Validation (invalidUN):");
    const isTaken = userService.invalidUN("yossi_c"); 
    const isAvailable = userService.invalidUN("new_guy_99");
    
    console.log(`Check 'yossi_c' (Expected: true - taken): ${isTaken}`);
    console.log(`Check 'new_guy_99' (Expected: false - available): ${isAvailable}`);

    // 3. Test Retrieving User by ID (getProfile)
    console.log("\n👤 Testing Retrieve User by ID:");
    const foundUser = userService.getUserById(myUser.id);
    if (foundUser && foundUser.name === "Yossi Cohen") {
        console.log(`✅ Successfully found user: ${foundUser.userName} with ID: ${foundUser.id}`);
    } else {
        console.log("❌ Failed to find user by ID.");
    }

    // 4. Test Validating Credentials (Login)
    console.log("\n🔐 Testing Login (validateCredentials):");
    
    // 4.1 Valid Login
    const validLogin = userService.validateCredentials("yossi_c", "secretPassword123");
    if (validLogin) {
        console.log("✅ Valid Login: Successfully returned user object.");
    } else {
        console.log("❌ Valid Login Failed!");
    }

    // 4.2 Invalid Login (Wrong password)
    const invalidLogin = userService.validateCredentials("yossi_c", "wrongPassword");
    if (!invalidLogin) {
        console.log("✅ Invalid Login: Successfully blocked and returned undefined.");
    } else {
        console.log("❌ Invalid Login Failed (It let the user in!).");
    }

} catch (error) {
    console.error("\n❌ Test Failed with error:", error.message);
}