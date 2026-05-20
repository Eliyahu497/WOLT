#ifndef SOCKETOUTPUT_H
#define SOCKETOUTPUT_H

#include "IOutputHandler.h"
#include <string>

class SocketOutput : public IOutputHandler {
private:
    int _clientSocket;

public:
    SocketOutput(int clientSocket);
    virtual ~SocketOutput() = default;


    virtual void printLine(const std::string& text) override;
};

#endif