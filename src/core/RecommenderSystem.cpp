#include "RecommenderSystem.h"
#include <sstream>
#include "CmdAdd.h"
#include "CmdRecommend.h"
#include "CmdHelp.h"

/**
 * @brief Constructs a new Recommender System object and registers available commands.
 * 
 * @param input A shared pointer to the input handler (used to read user commands).
 * @param output A shared pointer to the output handler (used to display messages/results).
 * @param store A shared pointer to the storage interface (used to save and load data).
 */
RecommenderSystem::RecommenderSystem(std::shared_ptr<IInputHandler> input,
                                     std::shared_ptr<IOutputHandler> output,
                                     std::shared_ptr<IStorage> store) 
    : inputHandler(input), outputHandler(output), storage(store) {
    registerCommands();
}

/**
 * @brief Starts the main loop of the system.
 * Continuously reads input, parses it into arguments, and executes the corresponding command
 * if it exists in the command map.
 */
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
        } 
    }
}

/**
 * @brief Initializes the command map by registering string keywords to their concrete command objects.
 */
void RecommenderSystem::registerCommands() {
    commandMap["add"] = std::make_shared<CmdAdd>(storage);
    commandMap["recommend"] = std::make_shared<CmdRecommend>(*storage, *outputHandler);
    commandMap["help"] = std::make_shared<CmdHelp>(outputHandler);
}

/**
 * @brief Parses a raw input line into a vector of arguments (words).
 * Validates the input to ensure it does not contain illegal whitespace characters (like tabs).
 * 
 * @param rawLine The raw string of text inputted by the user.
 * @return std::vector<std::string> A vector containing the separated words. Returns empty/partial if invalid whitespaces are found.
 */
std::vector<std::string> RecommenderSystem::parseInput(const std::string& rawLine) {
    std::vector<std::string> args;
    std::stringstream ss(rawLine);
    std::string word;
    for (char c : rawLine) {
        if(std::isspace(static_cast<unsigned char>(c)) && c != ' ') {
            return args;
        }
    }

    while (ss >> word) {
        args.push_back(word);
    }
    return args;
}