#include "CmdGet.h"
#include <algorithm>
#include <memory>
#include "../utils/ValidationUtils.h"
// Constructor: Initializes the GET command with the storage interface
CmdGet::CmdGet(std::shared_ptr<IStorage> storage) : storage(storage) {}

void CmdGet::execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) {
    // Validate input: Ensure exactly 2 arguments (userId, productId) and valid format
    if (args.size() != 2 || !utils::validateWriteArguments(args)) {
        output->printLine("400 Bad Request");
        return;
    }
    // Extract arguments for clarity
    std::string userId = args[0];
    std::string productId = args[1];
    // Retrieve all stored user data
    auto allData = storage->fetchAllData();       

    // Check if user exists, otherwise 404
    auto it = allData.find(userId);
    if (it == allData.end()) {
        output->printLine("404 Not Found");
        return;
    }
    // Calculate product recommendations using the recommendation engine
    std::vector<std::string> recommendations = engine.computeRecommendations(userId, productId, allData);
    std::string result = "";
    // If we have recommendations, format them into a space-separated string
    if (!recommendations.empty()) {
        // Simply do not reply as there are no recommendations 
        for (size_t i = 0; i < recommendations.size(); ++i) {
            result += recommendations[i];
            // Add a space after each product, except for the last one
            if (i < recommendations.size() - 1) {
                result += " ";
            }
        }
    }
    // Note: If recommendations vector is empty, 'result' remains an empty string.
    
    // Send success status and the result string back to the client
    output->printLine("200 Ok\n");
    output->printLine(result);
}