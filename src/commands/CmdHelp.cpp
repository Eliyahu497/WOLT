#include "CmdHelp.h"
/**
 * @brief Constructs a new CmdHelp object.
 * 
 * @param out A shared pointer to an IOutputHandler interface used to print messages.
 */
CmdHelp::CmdHelp(std::shared_ptr<IOutputHandler> out) : output(out) {}
/**
 * @brief Executes the help command.
 * Prints the list of available commands and their expected arguments to the output handler.
 * 
 * @param args A vector of string arguments passed to the command (not used in this specific command).
 */
void CmdHelp::execute(const std::vector<std::string>& args) {
    output->printLine("add [userid] [productid1] [productid2] …");
    output->printLine("recommend [userid] [productid]");
    output->printLine("help");
}