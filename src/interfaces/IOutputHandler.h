#ifndef IOUTPUTHANDLER_H
#define IOUTPUTHANDLER_H

#include <string>
/**
 * @brief An interface for handling input operations.
 * Classes implementing this interface must define how to read a line of input from a specific source.
 */
class IOutputHandler {
public:
    virtual ~IOutputHandler() = default;
    virtual void printLine(const std::string& text) = 0;
};

#endif // IOUTPUTHANDLER_H