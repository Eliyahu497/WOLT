#include "TerminalInput.h"
#include <iostream>
/**
 * @brief Reads a single line of input from the standard input (terminal).
 * 
 * @return std::string The complete line of text entered by the user.
 */
std::string TerminalInput::readLine() {
    std::string line;
    std::getline(std::cin, line);
    return line;
}