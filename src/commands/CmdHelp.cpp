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
void CmdHelp::execute(const std::vector<std::string>& args, shared_ptr<IOutputHandler> output) {
    if (!args.empty()) {
        output->printLine("400 Bad Request");
        return;
    }
    output->printLine("DELETE, arguments: [userid] [productid1] [productid2] …");
    output->printLine("GET, arguments: [userid] [productid]");
    output->printLine("PATCH, arguments: [userid] [productid1] [productid2] …");
    output->printLine("POST, arguments: [userid] [productid1] [productid2] …");
    output->printLine("HELP");
}