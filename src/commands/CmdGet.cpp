#include "CmdGet.h"
#include <algorithm>

CmdGet::CmdGet(IStorage& storage) 
    : storage(storage) {}


void CmdGet::execute(const std::vector<std::string>& args, shared_ptr<IOutputHandler> output) {
    if (args.size() != 2) {
        output->printLine("400 Bad Request");
        return;
    }
    std::string userId = args[0];
    std::string productId = args[1];
    auto allData = storage.fetchAllData();
        std::vector<std::string> recommendations = engine.computeRecommendations(userId, productId, allData);

    if (recommendations.empty()) {
        output->printLine("404 Not Found");
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