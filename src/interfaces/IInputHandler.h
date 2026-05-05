#ifndef IINPUTHANDLER_H
#define IINPUTHANDLER_H

#include <string>

/**
 * @brief An interface for handling input operations.
 * Classes implementing this interface must define how to read a line of input from a specific source.
 */

class IInputHandler {
public:
    /**
     * @brief Virtual destructor for the IInputHandler interface.
     * Ensures proper cleanup of derived classes when deleted through a base pointer.
     */
    virtual ~IInputHandler() = default;
    /**
     * @brief Reads a single line of text from the input source.
     * 
     * @return std::string The complete string read from the input.
     */
    virtual std::string readLine() = 0;
};

#endif // IINPUTHANDLER_H