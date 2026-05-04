#include <gtest/gtest.h>
#include "../src/commands/CmdAdd.h"
#include "../src/interfaces/IStorage.h"
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

    void addViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        lastUserId = userId;
        lastProducts = productIds;
        addViewsCalled = true;
    }

    // We don't need these for the CmdAdd test, so we provide empty implementations
    std::unordered_map<std::string, std::vector<std::string>> fetchAllData() override { return {}; }
    bool loadData() override { return true; }
};

/**
 * @brief Unit test for CmdAdd to ensure it parses arguments correctly.
 */
TEST(CmdAddTest, ExecuteCorrectlyParsesArguments) {
    // --- 1. Arrange ---
    auto mockStorage = std::make_shared<MockStorage>();
    CmdAdd command(mockStorage);
    
    // Simulating input: add user1 p101 p102
    std::vector<std::string> args = {"user1", "p101", "p102"};

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
    EXPECT_EQ(mockStorage->lastProducts[0], "p101");
    EXPECT_EQ(mockStorage->lastProducts[1], "p102");
}
