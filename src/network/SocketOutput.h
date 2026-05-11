#ifndef SOCKETOUTPUT_H
#define SOCKETOUTPUT_H

#include <string>

class SocketOutput {
private:
    int _clientSocket;

public:
    SocketOutput(int clientSocket);
    void printLine(const std::string& text);
};

#endif