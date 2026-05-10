#include "CmdDelete.h"

/**
 * @brief Constructor initializing command dependencies.
 */
CmdDelete::CmdDelete(std::shared_ptr<IStorage> storage, std::shared_ptr<IOutputHandler> output)
    : storage(storage), output(output) {}

/**
 * @brief Executes the DELETE command logic.
 * Validates arguments, checks if the user exists, and removes specified product views.
 */
void CmdDelete::execute(const std::vector<std::string>& args) {
    // Step 1: Basic validation - Ensure we received at least a UserId and one ProductId
    // if (args.size() < 2) {
    //     output->printLine("400 Bad Request");
    //     return;
    // }

    std::string userId = args[0];

    // Step 2: Enforce DELETE business rule - User MUST exist in the system
    if (!storage->userExists(userId)) {
        output->printLine("404 Not Found"); // Return 404 if trying to delete from a non-existent user
        return;
    }

    // Step 3: Extract the product IDs to be deleted (all arguments after the UserId)
    std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Step 4: Call the storage layer to remove these views
    storage->removeViews(userId, productIds);

    // Step 5: Print the required protocol success status
    output->printLine("204 No Content");
}