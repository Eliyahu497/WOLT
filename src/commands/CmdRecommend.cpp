#include "CmdRecommend.h"
#include <algorithm>

CmdRecommend::CmdRecommend(IStorage& storage, IOutputHandler& output) 
    : storage(storage), output(output) {}

void CmdRecommend::execute(const std::vector<std::string>& args) {
    if (args.size() < 2) {
        output.printLine("Error: Usage: recommend <userId> <productId>");
        return;
    }

    std::string userId = args[0];
    std::string productId = args[1];

    // שימוש בשם הפונקציה הנכון מהממשק
    auto allData = storage.fetchAllData();

    // הפעלת מנוע ההמלצות שלך
    std::vector<std::string> recommendations = engine.computeRecommendations(userId, productId, allData);

    if (recommendations.empty()) {
        output.printLine("No recommendations available.");
    } else {
        output.printLine("Recommended products:");
        for (const auto& item : recommendations) {
            output.printLine("- " + item);
        }
    }
}