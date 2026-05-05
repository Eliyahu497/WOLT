#pragma once
#include "IOutputHandler.h"
#include <string>
/**
 * @brief A concrete implementation of the IOutputHandler interface.
 * This class is responsible for printing output messages directly to the standard terminal (stdout).
 */
class TerminalOutput : public IOutputHandler {
public:
    /**
     * @brief Prints a single line of text to the terminal.
     * 
     * @param text The string message to be displayed to the user.
     */
    void printLine(const std::string& text) override;
};