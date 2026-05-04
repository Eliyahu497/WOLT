#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include "IInputHandler.h"
#include "IOutputHandler.h"
#include "IStorage.h"
#include "ICommand.h"

class RecommenderSystem {
public:
    RecommenderSystem(std::shared_ptr<IInputHandler> input,
          std::shared_ptr<IOutputHandler> output,
          std::shared_ptr<IStorage> storage);

    void start();

private:

    std::shared_ptr<IInputHandler> inputHandler;
    std::shared_ptr<IOutputHandler> outputHandler;
    std::shared_ptr<IStorage> storage;
    
    std::unordered_map<std::string, std::shared_ptr<ICommand>> commandMap;

    void registerCommands();
    std::vector<std::string> parseInput(const std::string& rawLine);
};