#ifndef IINPUTHANDLER_H
#define IINPUTHANDLER_H

#include <string>

class IInputHandler {
public:
    virtual ~IInputHandler() = default;
    virtual std::string readLine() = 0;
};

#endif // IINPUTHANDLER_H