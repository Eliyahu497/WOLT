#include <gtest/gtest.h>
#include "../src/repository/FileStorage.h"
#include <vector>
#include <string>
#include <cstdio> 

/**
 * @brief Test the persistence flow: Save to file and then load back into a new object.
 */
TEST(FileStorageTest, SaveAndLoadPersistence) {
    // --- 1. Arrange ---
    // Define a temporary test file path
    std::string testPath = "unit_test_db.txt";
    FileStorage storage(testPath);
    
    std::string userId = "user123";
    std::vector<std::string> products = {"p100", "p200", "p300"};

    // --- 2. Act ---
    // Store data in memory and trigger the file flush
    storage.addViews(userId, products);

    // Create a fresh instance to simulate a system restart
    FileStorage loader(testPath);
    bool loadResult = loader.loadData();

    // --- 3. Assert ---
    // Check if the loading process was successful
    EXPECT_TRUE(loadResult);

    // Fetch the loaded data to verify its content
    auto allData = loader.fetchAllData();
    
    // Ensure the user exists in the map
    ASSERT_NE(allData.find(userId), allData.end());
    
    // Verify that the number of stored products matches the input
    EXPECT_EQ(allData[userId].size(), 3);
    
    // Verify specific product IDs to ensure data integrity
    EXPECT_EQ(allData[userId][0], "p100");
    EXPECT_EQ(allData[userId][2], "p300");

    // --- Cleanup ---
    // Remove the temporary test file to keep the environment clean
    std::remove(testPath.c_str());
}

/**
 * @brief Test the behavior when attempting to load a file that does not exist.
 */
TEST(FileStorageTest, HandleMissingFile) {
    FileStorage storage("i_do_not_exist.txt");
    bool result = storage.loadData();
    
    // Should return false and handle the error gracefully without crashing
    EXPECT_FALSE(result);
}