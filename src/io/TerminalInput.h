#pragma once
#include "IInputHandler.h"
#include <string>
/**
 * @brief A concrete implementation of the IInputHandler interface.
 * This class is responsible for reading user input directly from the standard terminal (stdin).
 */
class TerminalInput : public IInputHandler {
public:
    /**
     * @brief Reads a single line of text inputted via the terminal.
     * 
     * @return std::string The complete string entered by the user before pressing Enter.
     */
    std::string readLine() override;
};