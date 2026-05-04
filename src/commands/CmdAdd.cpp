#include "CmdAdd.h"

/**
 * @brief Initialize the command with a storage provider.
 */
CmdAdd::CmdAdd(std::shared_ptr<IStorage> storage) : storage(storage) {}

/**
 * @brief Logic for processing the 'add' command.
 * Validates input size and delegates storage persistence.
 */
void CmdAdd::execute(const std::vector<std::string>& args) {
    // Requirement check: Must have at least a userId and one productId (size >= 2)
    if (args.size() < 2) {
        // No output is produced for the command as per requirements
        return;
    }

    // Extraction: First element is the user, the rest are product identifiers
    std::string userId = args[0];
    
    // Copying the range of product IDs from the arguments vector
    std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Delegate update and automatic file synchronization to the storage layer
    // The storage implementation is responsible for calling flushToFile() internally
    if (storage) {
        storage->addViews(userId, productIds);
    }

    // Control returns to the main loop without printing to stdout
}