#include "CmdRecommend.h"
#include <algorithm>

CmdRecommend::CmdRecommend(IStorage& storage, IOutputHandler& output) 
    : storage(storage), output(output) {}

void CmdRecommend::execute(const std::vector<std::string>& args) {
    if (args.size() < 2) {
        return;
    }

    std::string userId = args[0];
    std::string productId = args[1];

    // Using the correct function name from the interface
    auto allData = storage.fetchAllData();

// Running your recommendation engine
    std::vector<std::string> recommendations = engine.computeRecommendations(userId, productId, allData);

    if (recommendations.empty()) {
        return; 
    } else {
        std::string result = "";
        for (size_t i = 0; i < recommendations.size(); ++i) {
            result += recommendations[i];
            if (i < recommendations.size() - 1) {
                result += " ";
    }
        }
        output.printLine(result);
    }
}