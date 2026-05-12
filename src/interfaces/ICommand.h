#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <memory>
#include "IOutputHandler.h"
#include <string>
#include <vector>

class ICommand {
public:
    virtual ~ICommand() = default;
    
    // Every command receives its arguments as a vector of strings
    virtual void execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) = 0;
};

#endif // ICOMMAND_H