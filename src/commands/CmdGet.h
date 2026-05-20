#ifndef CMDGET_H
#define CMDGET_H

#include <memory>
#include <vector>
#include <string>
#include "../interfaces/ICommand.h"
#include "../recommendation/RecommendationEngine.h"
#include "../interfaces/IStorage.h"
#include "../interfaces/IOutputHandler.h"


class CmdGet : public ICommand {
private:

    std::shared_ptr<IStorage> storage;
    RecommendationEngine engine;

public:

    CmdGet(std::shared_ptr<IStorage> storage);
    

    void execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) override;
};

#endif