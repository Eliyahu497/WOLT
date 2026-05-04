#pragma once
#include "IOutputHandler.h"
#include <string>
class TerminalOutput : public IOutputHandler {
public:
    void printLine(const std::string& text) override;
};