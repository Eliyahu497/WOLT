#include "CmdHelp.h"
CmdHelp::CmdHelp(std::shared_ptr<IOutputHandler> out) : output(out) {}
void CmdHelp::execute(const std::vector<std::string>& args) {
    output->PrintLine("add [userid] [productid1] [productid2] …");
    output->PrintLine("recommend [userid] [productid]");
    output->PrintLine("help");
}