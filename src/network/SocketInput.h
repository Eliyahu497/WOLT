#ifndef SOCKETINPUT_H
#define SOCKETINPUT_H

#include "IInputHandler.h"
#include <string>

class SocketInput : public IInputHandler {
private:
    int _clientSocket;

public:
    SocketInput(int clientSocket);
    virtual ~SocketInput() = default;
    

    virtual std::string readLine() override; 
};

#endif