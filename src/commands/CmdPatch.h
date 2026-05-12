#ifndef CMDPATCH_H
#define CMDPATCH_H

#include "../interfaces/ICommand.h"
#include "../interfaces/IStorage.h"
#include "../interfaces/IOutputHandler.h"
#include <memory>

/**
 * @class CmdPatch
 * @brief Command to handle PATCH requests for updating viewed products for an existing user.
 * this command is only valid if the user already exists.
 */
class CmdPatch : public ICommand {
private:
    std::shared_ptr<IStorage> storage;       // Pointer to the persistent storage layer

public:
    /**
     * @brief Constructor for CmdPatch.
     */
    CmdPatch(std::shared_ptr<IStorage> storage);

    /**
     * @brief Executes the PATCH command logic.
     * @param args Command arguments containing the UserId followed by ProductIds to append.
     */
    void execute(const std::vector<std::string>& args,  shared_ptr<IOutputHandler> output) override;
};

#endif // CMDPATCH_H