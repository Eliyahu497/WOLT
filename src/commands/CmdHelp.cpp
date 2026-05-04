#include "CmdHelp.h"
CmdHelp::CmdHelp(std::shared_ptr<IOutputHandler> out) : output(out) {}
void CmdHelp::execute(const std::vector<std::string>& args) {
    output->printLine("add [userid] [productid1] [productid2] …");
    output->printLine("recommend [userid] [productid]");
    output->printLine("help");
}