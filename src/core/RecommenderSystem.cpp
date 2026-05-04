#include "RecommenderSystem.h"
#include <sstream>
#include "CmdAdd.h"
#include "CmdRecommend.h"

RecommenderSystem::RecommenderSystem(std::shared_ptr<IInputHandler> input,
                                     std::shared_ptr<IOutputHandler> output,
                                     std::shared_ptr<IStorage> store) 
    : inputHandler(input), outputHandler(output), storage(store) {
    registerCommands();
}

void RecommenderSystem::start() {
    while (true) {
        std::string rawLine = inputHandler->readLine();
        if (rawLine.empty()) continue;

        std::vector<std::string> args = parseInput(rawLine);
        if (args.empty()) continue;

        std::string commandName = args[0];
        args.erase(args.begin()); 

        if (commandMap.find(commandName) != commandMap.end()) {
            commandMap[commandName]->execute(args);
        } else {
            outputHandler->printLine("Unknown command: " + commandName);
        }
    }
}

void RecommenderSystem::registerCommands() {
    // רישום פקודות[cite: 2]
    commandMap["add"] = std::make_shared<CmdAdd>(storage);
    commandMap["recommend"] = std::make_shared<CmdRecommend>(*storage, *outputHandler);
}

std::vector<std::string> RecommenderSystem::parseInput(const std::string& rawLine) {
    std::vector<std::string> args;
    std::stringstream ss(rawLine);
    std::string word;
    while (ss >> word) {
        args.push_back(word);
    }
    return args;
}