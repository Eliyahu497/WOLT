#ifndef CMDPOST_H
#define CMDPOST_H

#include "../interfaces/ICommand.h"
#include "../interfaces/IStorage.h"
#include "../interfaces/IOutputHandler.h"
#include <memory>

/**
 * @class CmdPost
 * @brief Command to handle POST requests for creating a new user with their initial product views.
 * According to the protocol, this command is only valid if the user does not already exist.
 */
class CmdPost : public ICommand {
private:
    std::shared_ptr<IStorage> storage;       // Pointer to the persistent storage layer
    std::shared_ptr<IOutputHandler> output;   // Pointer to the network/console output handler

public:
    /**
     * @brief Constructor for CmdPost.
     * @param storage Shared pointer to the database/storage interface.
     * @param output Shared pointer to the output handler interface.
     */
    CmdPost(std::shared_ptr<IStorage> storage, std::shared_ptr<IOutputHandler> output);

    /**
     * @brief Executes the POST command logic.
     * Validates arguments, checks user existence, and updates the database.
     * @param args Command arguments containing the UserId followed by ProductIds.
     */
    void execute(const std::vector<std::string>& args) override;
};

#endif // CMDPOST_H