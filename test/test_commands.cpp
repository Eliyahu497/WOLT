
#include <gtest/gtest.h>
#include "../src/commands/CmdAdd.h"
#include "CmdHelp.h"
#include "../src/interfaces/IStorage.h"
#include "IOutputHandler.h"
#include "../src/commands/CmdPost.h"
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

    // Control flag to simulate user existence dynamically in tests
    bool mockUserExistsValue = false;

    void addViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        lastUserId = userId;
        lastProducts = productIds;
        addViewsCalled = true;
    }

    std::unordered_map<std::string, std::vector<std::string>> fetchAllData() override { return {}; }
    bool loadData() override { return true; }

    // --- Added for Exercise 2 to resolve compilation errors ---

    bool userExists(const std::string& userId) override { 
        return mockUserExistsValue; 
    }

    void removeViews(const std::string& userId, const std::vector<std::string>& productIds) override {
    }

};

class MockOutputHandler : public IOutputHandler {
public:
    std::vector<std::string> messages;
    void printLine(const std::string& text) override {
        messages.push_back(text);
    }
};

/**
 * @brief Unit test for CmdAdd to ensure it parses arguments correctly.
 * Note: Product IDs must be valid integers due to recent validation updates.
 */
TEST(CmdAddTest, ExecuteCorrectlyParsesArguments) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    CmdAdd command(mockStorage);
    
    // Simulating input with valid integer product IDs: add user1 101 102
    std::vector<std::string> args = {"user1", "101", "102"};

    // --- 2. Act ---
    command.execute(args);

    // --- 3. Assert ---
    // Check if the storage was actually called
    EXPECT_TRUE(mockStorage->addViewsCalled);
    
    // Check if the UserId was passed correctly
    EXPECT_EQ(mockStorage->lastUserId, "user1");
    
    // Check if the number of products is correct
    ASSERT_EQ(mockStorage->lastProducts.size(), 2);
    
    // Check if the product IDs match
    EXPECT_EQ(mockStorage->lastProducts[0], "101");
    EXPECT_EQ(mockStorage->lastProducts[1], "102");
}

TEST(CmdHelpTest, PrintsHelpMenuCorrectly) {
    auto mockOut = std::make_shared<MockOutputHandler>();
    CmdHelp helpCommand(mockOut);
    std::vector<std::string> emptyArgs;
    helpCommand.execute(emptyArgs);
    ASSERT_EQ(mockOut->messages.size(), 3);
    EXPECT_FALSE(mockOut->messages.empty());
    EXPECT_EQ(mockOut->messages[0], "add [userid] [productid1] [productid2] …");
    EXPECT_EQ(mockOut->messages[1], "recommend [userid] [productid]");
    EXPECT_EQ(mockOut->messages[2], "help");
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
    CmdPost command(mockStorage, mockOut);
    
    std::vector<std::string> args = {"shira", "p101", "p102"};

    // --- 2. Act ---
    command.execute(args);

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
    CmdPost command(mockStorage, mockOut);
    
    std::vector<std::string> args = {"shira", "p101"};

    // --- 2. Act ---
    command.execute(args);

    // --- 3. Assert ---
    EXPECT_FALSE(mockStorage->addViewsCalled); // Assert that NO database write was executed
    ASSERT_EQ(mockOut->messages.size(), 1); // Verify exactly one output line was written
    EXPECT_EQ(mockOut->messages[0], "400 Bad Request"); // Verify correct error status code
}

/**
 * @brief Placeholder test for the upcoming PATCH command logic.
 */
TEST(CmdPatchTest, ExecutePatchSuccessPlaceholder) {
    // TODO: Implement TDD tests for CmdPatch
    EXPECT_TRUE(true);
}

/**
 * @brief Placeholder test for the upcoming DELETE command logic.
 */
TEST(CmdDeleteTest, ExecuteDeleteSuccessPlaceholder) {
    // TODO: Implement TDD tests for CmdDelete
    EXPECT_TRUE(true);
}