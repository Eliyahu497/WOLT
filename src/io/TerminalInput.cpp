#include "TerminalInput.h"
#include <iostream>
std::string TerminalInput::readLine() {
    std::string line;
    std::getline(std::cin, line);
    return line;
}