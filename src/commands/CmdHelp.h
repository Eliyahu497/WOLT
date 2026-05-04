#pragma once

#include "ICommand.h"
#include "IOutputHandler.h"
#include <memory>

class CmdHelp : public ICommand {
private:
    std::shared_ptr<IOutputHandler> output;
public:
    CmdHelp(std::shared_ptr<IOutputHandler> out);
    void execute(const std::vector<std::string>& args) override;
};
