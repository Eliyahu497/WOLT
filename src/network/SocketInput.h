#ifndef SOCKETINPUT_H
#define SOCKETINPUT_H

#include "IInputHandler.h" // הוספת הממשק
#include <string>

class SocketInput : public IInputHandler { // ירושה מהממשק
private:
    int _clientSocket;

public:
    SocketInput(int clientSocket);
    virtual ~SocketInput() = default;
    
    // מימוש הפונקציה מהממשק
    virtual std::string readLine() override; 
};

#endif