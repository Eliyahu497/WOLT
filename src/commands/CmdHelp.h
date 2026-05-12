#pragma once

#include "ICommand.h"
#include "IOutputHandler.h"
#include <memory>
/**
 * @brief A command class responsible for displaying the help menu.
 * It inherits from the ICommand interface and uses an IOutputHandler to print instructions.
 */
class CmdHelp : public ICommand {
private:
    /**
     * @brief A shared pointer to the output handler used to display text to the user.
     */
public:
    /**
     * @brief Constructs a new CmdHelp object.
     * 
     * @param out A shared pointer to an IOutputHandler implementation.
     */
    CmdHelp();
    /**
     * @brief Executes the help command, printing all available commands and their usage.
     * 
     * @param args A vector of string arguments (typically empty for the help command).
     */
    void execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) override;
};
