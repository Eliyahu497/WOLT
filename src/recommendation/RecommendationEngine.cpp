#include "RecommendationEngine.h"
#include <algorithm>
#include <map>

using namespace std;

vector<string> RecommendationEngine::computeRecommendations(const string& userId, const string& productId, const unordered_map<string, vector<string>>& allData) {
    auto it = allData.find(userId);
    if (it == allData.end()) return {};
    const vector<string>& targetUserProducts = it->second;

    map<string, int> productWeights;

    // Find users who watched the target product[cite: 1]
    for (const auto& [otherUserId, otherProducts] : allData) {
        if (otherUserId == userId) continue;

        bool watchedTarget = (find(otherProducts.begin(), otherProducts.end(), productId) != otherProducts.end());

        if (watchedTarget) {
            int similarity = calculateUserSimilarity(targetUserProducts, otherProducts);

            for (const string& p : otherProducts) {
                // Ignore the current product and products the user already saw[cite: 1]
                if (p != productId && find(targetUserProducts.begin(), targetUserProducts.end(), p) == targetUserProducts.end()) {
                    productWeights[p] += similarity;
                }
            }
        }
    }

    vector<pair<string, int>> rankedProducts(productWeights.begin(), productWeights.end());

    // Sort by relevance score, then by ID[cite: 1]
    sort(rankedProducts.begin(), rankedProducts.end(), [](const pair<string, int>& a, const pair<string, int>& b) {
        if (a.second != b.second) return a.second > b.second;
        // If scores are equal, sort by product ID numerically
        try {
            return stoi(a.first) < stoi(b.first);
        } catch (...) {
            // Fallback: If for some reason the ID is not a valid number, fallback to string comparison
            return a.first < b.first;
        }   
     });

    vector<string> finalRecommendations;
    for (int i = 0; i < min((int)rankedProducts.size(), 10); ++i) {
        finalRecommendations.push_back(rankedProducts[i].first);
    }

    return finalRecommendations;
}

int RecommendationEngine::calculateUserSimilarity(const vector<string>& userA, const vector<string>& userB) {
    int similarityScore = 0;
    for (const string& item : userA) {
        if (find(userB.begin(), userB.end(), item) != userB.end()) {
            similarityScore++; 
        }
    }
    return similarityScore;
}