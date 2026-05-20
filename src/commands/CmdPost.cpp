#include "CmdPost.h"
#include "../utils/ValidationUtils.h"
#include <algorithm>
#include <memory>
/**
 * @brief Constructor initializing command dependencies.
 */
CmdPost::CmdPost(std::shared_ptr<IStorage> storage)
    : storage(storage) {}

/**
 * @brief Executes the POST command logic.
 * Validates arguments, checks user existence, and updates the database.
 */
void CmdPost::execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) {
    // Step 1: Syntactic validation using our shared utility
    if (!utils::validateWriteArguments(args)) {
        output->printLine("400 Bad Request");
        return;
    }

    std::string userId = args[0];

    // Step 2: Check if the user already exists using Ex2 storage method
    if (storage->userExists(userId)) {
        output->printLine("404 Not Found");
        return;
    }

    // Step 3: Extract the remaining arguments as product IDs
    std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Step 4: Save the user and their initial views to the storage layer
    storage->addViews(userId, productIds);

    // Step 5: Print the required protocol success status
    output->printLine("201 Created");
}