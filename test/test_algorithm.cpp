#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <unordered_map>
#include "../src/recommendation/RecommendationEngine.h"

using namespace std;

// Test the full recommendation flow based on PDF Example (User 1, Product 104)
TEST(AlgorithmTest, FullRecommendation_PdfExample) {
    RecommendationEngine engine;

    // Mock data based on the assignment appendix
    unordered_map<string, vector<string>> db = {
        {"1", {"100", "101", "102", "103"}},
        {"2", {"101", "102", "104", "105", "106"}},
        {"3", {"100", "104", "105", "107", "108"}},
        {"6", {"100", "103", "104", "110", "111", "112", "113"}},
        {"8", {"101", "104", "105", "106", "109", "111", "114"}}
    };

    // Recommended for User 1 based on Product 104[cite: 1]
    vector<string> results = engine.computeRecommendations("1", "104", db);

    // Assertions based on the provided example weights[cite: 1]
    ASSERT_GE(results.size(), 3);
    EXPECT_EQ(results[0], "105"); // Should have weight 4[cite: 1]
    EXPECT_EQ(results[1], "106"); // Weight 3, sorted by ID[cite: 1]
    EXPECT_EQ(results[2], "111"); // Weight 3, sorted by ID[cite: 1]
}

// Keep your previous similarity tests here as well...