#ifndef CMDADD_H
#define CMDADD_H

#include "../interfaces/ICommand.h"
#include "../interfaces/IStorage.h"
#include <memory>
#include <vector>
#include <string>

/**
 * @brief Command implementation for adding user viewing history.
 * Inherits from ICommand and interacts with the storage layer.
 */
class CmdAdd : public ICommand {
private:
    std::shared_ptr<IStorage> storage; // Reference to the system's data storage

public:
    /**
     * @brief Constructor for CmdAdd.
     * @param storage Shared pointer to an IStorage implementation.
     */
    explicit CmdAdd(std::shared_ptr<IStorage> storage);

    /**
     * @brief Executes the add command logic.
     * Expects: args[0] as userId, args[1...n] as productIds.
     * @param args Vector of strings containing the command arguments.
     */
    void execute(const std::vector<std::string>& args) override;
};

#endif // CMDADD_H