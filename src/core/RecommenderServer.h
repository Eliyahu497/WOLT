#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include "IStorage.h"
#include "ICommand.h"

/**
 * @brief The core system responsible for managing the input loop, command parsing, and execution.
 * It ties together the input, output, and storage interfaces.
 */
class RecommenderServer {
public:
    
    RecommenderServer(int port, std::shared_ptr<IStorage> storage);

    /**
     * @brief Starts the main application loop.
     * Continuously reads user input, parses it, and executes the corresponding commands.
     */
    void start();

private:
    int port;
    int ServerSocket;
    
    /**
     * @brief Handles saving and loading data.
     */
    std::shared_ptr<IStorage> storage;
    /**
     * @brief A map linking command string names (like "add" or "help") to their concrete ICommand objects.
     */
    std::unordered_map<std::string, std::shared_ptr<ICommand>> commandMap;
    /**
     * @brief Registers and maps all available application commands to the commandMap.
     */
    void registerCommands();
    /**
     * @brief Parses a raw line of string input into isolated arguments.
     * 
     * @param rawLine The complete string inputted by the user.
     * @return std::vector<std::string> A list of extracted string arguments.
     */
    std::vector<std::string> parseInput(const std::string& rawLine);
};