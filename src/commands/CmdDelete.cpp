#include "CmdDelete.h"
#include "../utils/ValidationUtils.h"
#include <algorithm>
#include <memory>
#include <unordered_set>
/**
 * @brief Constructor initializing command dependencies.
 */
CmdDelete::CmdDelete(std::shared_ptr<IStorage> storage)
    : storage(storage) {}

/**
 * @brief Executes the DELETE command logic.
 * Validates arguments, checks if the user exists, and removes specified product views.
 */
void CmdDelete::execute(const std::vector<std::string>& args,  std::shared_ptr<IOutputHandler> output) {
   // Step 1: Syntactic validation (Length + Number check) -> 400 Bad Request
    if (!utils::validateWriteArguments(args)) {
        output->printLine("400 Bad Request");
        return;
    }

    std::string userId = args[0];

    // Step 2: Enforce DELETE business rule - User MUST exist in the system
    if (!storage->userExists(userId)) {
        output->printLine("404 Not Found"); // Return 404 if trying to delete from a non-existent user
        return;
    }

    // Extract the product IDs to be deleted (all arguments after the UserId)
    std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Check for duplicate product IDs in the command
    std::unordered_set<std::string> uniqueProducts;
    for (const auto& prodId : productIds) {
        if (!uniqueProducts.insert(prodId).second) {
            output->printLine("400 Bad Request");
            return;
        }
    }

    // Step 3: Logical validation - Ensure ALL requested products currently exist in the user's views
    auto allData = storage->fetchAllData();
    auto it = allData.find(userId);
    if (it == allData.end()) {
        output->printLine("404 Not Found");
        return;
    }

    const auto& currentViews = it->second;
    for (const auto& prodId : productIds) {
        // If even one product to delete is not found in the user's views, fail with 404
        if (std::find(currentViews.begin(), currentViews.end(), prodId) == currentViews.end()) {
            output->printLine("404 Not Found");
            return;
        }
    }

    // Step 4: Call the storage layer to remove these views
    storage->removeViews(userId, productIds);

    // Step 5: Print the required protocol success status
    output->printLine("204 No Content");
}