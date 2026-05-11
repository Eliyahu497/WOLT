#ifndef SOCKETOUTPUT_H
#define SOCKETOUTPUT_H

#include "IOutputHandler.h" // הוספת הממשק
#include <string>

class SocketOutput : public IOutputHandler { // ירושה מהממשק
private:
    int _clientSocket;

public:
    SocketOutput(int clientSocket);
    virtual ~SocketOutput() = default;

    // מימוש הפונקציה מהממשק
    virtual void printLine(const std::string& text) override;
};

#endif