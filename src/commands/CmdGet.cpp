#include "CmdGet.h"
#include <algorithm>
#include <memory>

CmdGet::CmdGet(std::shared_ptr<IStorage> storage) : storage(storage) {}

void CmdGet::execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) {
    if (args.size() != 2) {
        output->printLine("400 Bad Request");
        return;
    }
    std::string userId = args[0];
    std::string productId = args[1];
    
    auto allData = storage->fetchAllData();       

    // Check if user and product exist, otherwise 404
    auto it = allData.find(userId);
    if (it == allData.end() || std::find(it->second.begin(), it->second.end(), productId) == it->second.end()) {
        output->printLine("404 Not Found");
        return;
    }

    std::vector<std::string> recommendations = engine.computeRecommendations(userId, productId, allData);

    if (recommendations.empty()) {
        // Simply do not reply as there are no recommendations
        return; 
    } else {
        std::string result = "";
        for (size_t i = 0; i < recommendations.size(); ++i) {
            result += recommendations[i];
            if (i < recommendations.size() - 1) {
                result += " ";
            }
        }
        output->printLine("200 Ok\n");
        output->printLine(result);
    }
}