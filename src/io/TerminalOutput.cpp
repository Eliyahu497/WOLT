#include "TerminalOutput.h"
#include <iostream>
/**
 * @brief Prints a line of text to the standard output (terminal).
 * 
 * @param text The string message to be printed.
 */
void TerminalOutput::printLine(const std::string& text) {
    std::cout << text << std::endl;
}