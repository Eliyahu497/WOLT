#ifndef IOUTPUTHANDLER_H
#define IOUTPUTHANDLER_H

#include <string>

class IOutputHandler {
public:
    virtual ~IOutputHandler() = default;
    virtual void printLine(const std::string& text) = 0;
};

#endif // IOUTPUTHANDLER_H