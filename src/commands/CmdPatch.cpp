#include "CmdPatch.h"
#include "../utils/ValidationUtils.h"

/**
 * @brief Constructor initializing command dependencies.
 */
CmdPatch::CmdPatch(std::shared_ptr<IStorage> storage, std::shared_ptr<IOutputHandler> output)
    : storage(storage), output(output) {}

/**
 * @brief Executes the PATCH command logic.
 * Validates arguments, checks if the user exists, and appends product views.
 */
void CmdPatch::execute(const std::vector<std::string>& args) {
    // Step 1: Syntactic validation using our shared utility
    if (!utils::validateWriteArguments(args)) {
        output->printLine("400 Bad Request");
        return;
    }
    
    std::string userId = args[0];

    // Step 2: Enforce PATCH business rule - User MUST already exist in the system
    if (!storage->userExists(userId)) {
        output->printLine("404 Not Found"); // Return 404 if trying to patch a non-existent user
        return;
    }

    // Step 3: Extract the product IDs (all arguments after the UserId)
    std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Step 4: Append the new views to the existing user's history
    storage->addViews(userId, productIds);

    // Step 5: Print the required protocol success status for a successful patch
    output->printLine("204 No Content");
}