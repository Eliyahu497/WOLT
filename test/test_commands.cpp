
#include <gtest/gtest.h>

#include "CmdHelp.h"
#include "../src/interfaces/IStorage.h"
#include "IOutputHandler.h"
#include "../src/commands/CmdPost.h"
#include "../src/commands/CmdPatch.h"
#include "../src/commands/CmdDelete.h"
#include "../src/commands/CmdGet.h"
#include <memory>
#include <vector>
#include <string>

/**
 * @brief A Mock implementation of IStorage for testing purposes.
 * It records the last call to addViews instead of writing to a file.
 */
class MockStorage : public IStorage {
public:
    std::string lastUserId;
    std::vector<std::string> lastProducts;
    bool addViewsCalled = false;
    bool removeViewsCalled = false; // New flag for testing DELETE

    // Control flag to simulate user existence dynamically in tests
    bool mockUserExistsValue = false;

    void addViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        lastUserId = userId;
        lastProducts = productIds;
        addViewsCalled = true;
    }

    std::unordered_map<std::string, std::vector<std::string>> fetchAllData() override { 
    std::unordered_map<std::string, std::vector<std::string>> mockMap;
    mockMap["shira"] = {"101", "102", "103", "104"};
    return mockMap; 
}
    bool loadData() override { return true; }

    // --- Added for Exercise 2 to resolve compilation errors ---

    bool userExists(const std::string& userId) override { 
        return mockUserExistsValue; 
    }

    void removeViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        lastUserId = userId;
        lastProducts = productIds;
        removeViewsCalled = true; // Mark as called
    }

};

class MockOutputHandler : public IOutputHandler {
public:
    std::vector<std::string> messages;
    void printLine(const std::string& text) override {
        messages.push_back(text);
    }
};



TEST(CmdHelpTest, PrintsHelpMenuCorrectly) {
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdHelp helpCommand;
    std::vector<std::string> emptyArgs;
    helpCommand.execute(emptyArgs, mockOut);
    ASSERT_EQ(mockOut->messages.size(), 5);
    EXPECT_FALSE(mockOut->messages.empty());
    EXPECT_EQ(mockOut->messages[0], "DELETE, arguments: [userid] [productid1] [productid2] …");
    EXPECT_EQ(mockOut->messages[1], "GET, arguments: [userid] [productid]");
    EXPECT_EQ(mockOut->messages[2], "PATCH, arguments: [userid] [productid1] [productid2] …");
    EXPECT_EQ(mockOut->messages[3], "POST, arguments: [userid] [productid1] [productid2] …");
    EXPECT_EQ(mockOut->messages[4], "HELP");
}

// ============================================================================
// --- Exercise 2
// ============================================================================

/**
 * @brief Test Case 1: Verifies that POST succeeds and returns "201 Created"
 * when the user does not exist yet.
 */
TEST(CmdPostTest, SuccessWhenUserDoesNotExist) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    mockStorage->mockUserExistsValue = false; // Simulate that the user does not exist
    
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdPost command(mockStorage);
    
    std::vector<std::string> args = {"shira", "101", "102"};

    // --- 2. Act ---
    command.execute(args, mockOut);

    // --- 3. Assert ---
    EXPECT_TRUE(mockStorage->addViewsCalled); // Verify that data was pushed to storage
    EXPECT_EQ(mockStorage->lastUserId, "shira"); // Verify correct user ID was passed
    ASSERT_EQ(mockOut->messages.size(), 1); // Verify exactly one output line was written
    EXPECT_EQ(mockOut->messages[0], "201 Created"); // Verify correct success message
}

/**
 * @brief Test Case 2: Verifies that POST fails and returns "400 Bad Request"
 * when attempting to recreate an already existing user.
 */
TEST(CmdPostTest, FailWhenUserAlreadyExists) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    mockStorage->mockUserExistsValue = true; // Simulate that the user already exists!
    
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdPost command(mockStorage);
    
    std::vector<std::string> args = {"shira", "101"};

    // --- 2. Act ---
    command.execute(args, mockOut);

    // --- 3. Assert ---
    EXPECT_FALSE(mockStorage->addViewsCalled); // Assert that NO database write was executed
    ASSERT_EQ(mockOut->messages.size(), 1); // Verify exactly one output line was written
    EXPECT_EQ(mockOut->messages[0], "404 Bad Request"); // Verify correct error status code
}

/**
 * @brief Test Case 1: Verifies that PATCH succeeds and returns "204 No Content"
 * when attempting to update an already existing user.
 */
TEST(CmdPatchTest, SuccessWhenUserExists) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    mockStorage->mockUserExistsValue = true; // Simulate that the user already exists
    
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdPatch command(mockStorage);
    
    std::vector<std::string> args = {"shira", "103", "104"};

    // --- 2. Act ---
    command.execute(args, mockOut);

    // --- 3. Assert ---
    EXPECT_TRUE(mockStorage->addViewsCalled); // Verify that data was pushed to storage
    EXPECT_EQ(mockStorage->lastUserId, "shira");
    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "204 No Content"); // Verify correct success code
}

/**
 * @brief Test Case 2: Verifies that PATCH fails and returns "404 Not Found"
 * when attempting to patch a non-existent user.
 */
TEST(CmdPatchTest, FailWhenUserDoesNotExist) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    mockStorage->mockUserExistsValue = false; // Simulate that the user does NOT exist!
    
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdPatch command(mockStorage);
    
    std::vector<std::string> args = {"shira", "103"};

    // --- 2. Act ---
    command.execute(args, mockOut);

    // --- 3. Assert ---
    EXPECT_FALSE(mockStorage->addViewsCalled); // Assert that NO database write was executed
    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "404 Not Found"); // Verify correct 404 error code
}

/**
 * @brief Test Case 1: Verifies that DELETE succeeds and returns "204 No Content"
 * when attempting to remove views from an existing user.
 */
TEST(CmdDeleteTest, SuccessWhenUserExists) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    mockStorage->mockUserExistsValue = true; // Simulate that the user exists

    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdDelete command(mockStorage);

    std::vector<std::string> args = {"shira", "101", "102"};

    // --- 2. Act ---
    command.execute(args, mockOut);

    // --- 3. Assert ---
    EXPECT_TRUE(mockStorage->removeViewsCalled); // Verify that removeViews was executed
    EXPECT_EQ(mockStorage->lastUserId, "shira");
    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "204 No Content"); // Verify correct status code
}

/**
 * @brief Test Case 2: Verifies that DELETE fails and returns "404 Not Found"
 * when attempting to delete views from a non-existent user.
 */
TEST(CmdDeleteTest, FailWhenUserDoesNotExist) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    mockStorage->mockUserExistsValue = false; // Simulate that the user does NOT exist

    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdDelete command(mockStorage);

    std::vector<std::string> args = {"shira", "101"};

    // --- 2. Act ---
    command.execute(args, mockOut);

    // --- 3. Assert ---
    EXPECT_FALSE(mockStorage->removeViewsCalled); // Assert that NO database deletion was executed
    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "404 Not Found"); // Verify correct 404 error code
}

/**
 * @brief Test Case 1: Verifies that GET fails and returns "400 Bad Request"
 * when given an incorrect number of arguments (e.g., missing product ID).
 */
TEST(CmdGetTest, FailOnIncorrectArgumentCount) {
    auto mockStorage = std::make_shared<MockStorage>();
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdGet command(mockStorage);

    // Providing only userId instead of [userid] [productid]
    std::vector<std::string> args = {"shira"};

    command.execute(args, mockOut);

    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "400 Bad Request");
}

/**
 * @brief Test Case 2: Verifies that GET fails and returns "404 Not Found"
 * when looking up a user who does not exist in the database mapping.
 */
TEST(CmdGetTest, FailWhenUserDoesNotExist) {
    auto mockStorage = std::make_shared<MockStorage>();
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdGet command(mockStorage);

    // 'unknown_user' does not exist in our mockStorage's fetchAllData map
    std::vector<std::string> args = {"unknown_user", "101"};

    command.execute(args, mockOut);

    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "404 Not Found");
}

/**
 * @brief Test Case 3: Verifies that GET fails and returns "404 Not Found"
 * when the user exists but the specified item is not found in their history.
 */
TEST(CmdGetTest, FailWhenProductNotInUserHistory) {
    auto mockStorage = std::make_shared<MockStorage>();
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdGet command(mockStorage);

    // 'shira' exists, but product '999' is not in her target view history vector
    std::vector<std::string> args = {"shira", "999"};

    command.execute(args, mockOut);

    ASSERT_EQ(mockOut->messages.size(), 1);
    EXPECT_EQ(mockOut->messages[0], "404 Not Found");
}