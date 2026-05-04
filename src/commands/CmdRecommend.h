#ifndef CMDRECOMMEND_H
#define CMDRECOMMEND_H

#include "../interfaces/ICommand.h"
#include "../recommendation/RecommendationEngine.h"
#include "../interfaces/IStorage.h"
#include "../interfaces/IOutputHandler.h"

class CmdRecommend : public ICommand {
private:
    IStorage& storage;
    IOutputHandler& output;
    RecommendationEngine engine;

public:
    CmdRecommend(IStorage& storage, IOutputHandler& output);
    void execute(const std::vector<std::string>& args) override;
};

#endif