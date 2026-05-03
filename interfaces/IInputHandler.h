#pragma once
#include <string>

class IInputHandler {
public:
    virtual ~IInputHandler() = default;
    virtual std::string readLine() = 0;
};