#include "CmdAdd.h"
#include <stdexcept>
#include <string>
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
    std::vector<std::string> productIds;

    // Iterate through the remaining arguments (expected to be product IDs)
    for (size_t i = 1; i < args.size(); ++i) {
        try {
            // Attempt to convert the string argument to an integer just to VALIDATE it.
            // We don't need to save the int result, we just want to see if it throws an error.
            std::stoi(args[i]); 
        } 
        catch (const std::invalid_argument& e) {
            // The input is not a valid number (e.g., contains letters). 
            // Skip this argument and proceed to the next one.
            return; 
        } 
        catch (const std::out_of_range& e) {
            // The number is too large to be represented by an int type. 
            // Skip this argument and proceed to the next one.
            return;
        }
        
        // If the try block succeeded without throwing, args[i] is a valid number!
        // Since args[i] is already a string, we can push it directly.
        productIds.push_back(args[i]);
    }

    // If no valid product IDs were found (all were invalid), the vector will be empty.
    // In this case, there is nothing to update in the storage.
    if (productIds.empty()) {
        return;
    }

    // Copying the range of product IDs from the arguments vector
    //std::vector<std::string> productIds(args.begin() + 1, args.end());

    // Delegate update and automatic file synchronization to the storage layer
    // The storage implementation is responsible for calling flushToFile() internally
    if (storage) {
        storage->addViews(userId, productIds);
    }

    // Control returns to the main loop without printing to stdout
}