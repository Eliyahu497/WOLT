#ifndef SOCKETINPUT_H
#define SOCKETINPUT_H

#include <string>
#include <vector>

class SocketInput {
private:
    int _clientSocket; // המזהה של הסוקט מול הלקוח

public:
    SocketInput(int clientSocket);
    std::string readLine(); // הפונקציה המרכזית
};

#endif