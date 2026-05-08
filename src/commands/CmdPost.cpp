#include "CmdPost.h"

/**
 * @brief Constructor initializing command dependencies.
 */
CmdPost::CmdPost(std::shared_ptr<IStorage> storage, std::shared_ptr<IOutputHandler> output)
    : storage(storage), output(output) {}

/**
 * @brief Executes the POST command logic.
 * Validates arguments, checks user existence, and updates the database.
 */
void CmdPost::execute(const std::vector<std::string>& args) {
    // Step 1: Basic validation - Ensure we received at least a UserId and one ProductId
    if (args.size() < 2) {
        output->printLine("400 Bad Request");
        return;
    }

    std::string userId = args[0];

    // Step 2: Check if the user already exists using Ex2 storage method
    if (storage->userExists(userId)) {
        output->printLine("400 Bad Request"); // Duplicate user creation is invalid for POST
        return;
    }

    // Step 3: Extract the remaining arguments as product IDs
    std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Step 4: Save the user and their initial views to the storage layer
    storage->addViews(userId, productIds);

    // Step 5: Print the required protocol success status
    output->printLine("201 Created");
}