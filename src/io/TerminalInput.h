#pragma once
#include "IInputHandler.h"
#include <string>
class TerminalInput : public IInputHandler {
public:
    std::string readLine() override;
};