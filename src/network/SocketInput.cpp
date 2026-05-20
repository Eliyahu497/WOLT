#include "SocketInput.h"
#include <sys/socket.h>
#include <unistd.h>
#include <stdexcept>

SocketInput::SocketInput(int clientSocket) : _clientSocket(clientSocket) {}

std::string SocketInput::readLine() {
    std::string line = "";
    char buffer;
    ssize_t bytesRead;

    while (true) {
        bytesRead = recv(_clientSocket, &buffer, 1, 0);

        if (bytesRead == 0) {

            throw std::runtime_error("Client disconnected");
        }
        if (bytesRead < 0) {

            throw std::runtime_error("Socket read error");
        }

        if (buffer == '\n') {
            break; 
        }
        

        if (buffer != '\r') {
            line += buffer;
        }
    }
    return line;
}