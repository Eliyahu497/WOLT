#pragma once
#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

class RecommendationEngine {
public:
    // Main function to compute and return recommendations
    vector<string> computeRecommendations(const string& userId, const string& productId, const unordered_map<string, vector<string>>& allData);

    // Helper function to calculate mathematical similarity between two users
    // Temporarily set to public for Test-Driven Development (TDD)
    int calculateUserSimilarity(const vector<string>& userA, const vector<string>& userB);
};