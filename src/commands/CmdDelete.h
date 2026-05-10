#ifndef CMDDELETE_H
#define CMDDELETE_H

#include "../interfaces/ICommand.h"
#include "../interfaces/IStorage.h"
#include "../interfaces/IOutputHandler.h"
#include <memory>

/**
 * @class CmdDelete
 * @brief Command to handle DELETE requests for removing specific product views from an existing user's history.
 * This command is only valid if the user exists.
 */
class CmdDelete : public ICommand {
private:
    std::shared_ptr<IStorage> storage;       // Pointer to the persistent storage layer
    std::shared_ptr<IOutputHandler> output;   // Pointer to the network/console output handler

public:
    /**
     * @brief Constructor for CmdDelete.
     */
    CmdDelete(std::shared_ptr<IStorage> storage, std::shared_ptr<IOutputHandler> output);

    /**
     * @brief Executes the DELETE command logic.
     * @param args Command arguments containing the UserId followed by ProductIds to delete.
     */
    void execute(const std::vector<std::string>& args) override;
};

#endif // CMDDELETE_H