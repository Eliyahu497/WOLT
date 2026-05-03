#pragma once
#include <string>

class IOutputHandler {
public:
    virtual ~IOutputHandler() = default;
    virtual void printLine(const std::string& text) = 0;
};