#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include "IInputHandler.h"
#include "IOutputHandler.h"
#include "IStorage.h"
#include "ICommand.h"

/**
 * @brief The core system responsible for managing the input loop, command parsing, and execution.
 * It ties together the input, output, and storage interfaces.
 */
class RecommenderSystem {
public:
    /**
     * @brief Constructs a new Recommender System object.
     * 
     * @param input A shared pointer to an IInputHandler implementation for receiving user input.
     * @param output A shared pointer to an IOutputHandler implementation for displaying messages.
     * @param storage A shared pointer to an IStorage implementation for data persistence.
     */
    RecommenderSystem(std::shared_ptr<IInputHandler> input,
          std::shared_ptr<IOutputHandler> output,
          std::shared_ptr<IStorage> storage);

    /**
     * @brief Starts the main application loop.
     * Continuously reads user input, parses it, and executes the corresponding commands.
     */
    void start();

private:
    /**
     * @brief Handles reading input from the user (e.g., from the terminal).
     */
    std::shared_ptr<IInputHandler> inputHandler;
    /**
     * @brief Handles writing output to the user (e.g., to the terminal).
     */
    std::shared_ptr<IOutputHandler> outputHandler;
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