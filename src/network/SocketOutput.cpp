#include "SocketOutput.h"
#include <sys/socket.h>
#include <stdexcept>
#include <string>
#include <unistd.h>
SocketOutput::SocketOutput(int clientSocket) : _clientSocket(clientSocket) {}

void SocketOutput::printLine(const std::string& text) {
    std::string message = text + "\n";
    

    ssize_t sent = send(_clientSocket, message.c_str(), message.length(), MSG_NOSIGNAL);
    
    if (sent < 0) {
        throw std::runtime_error("Failed to send data to socket");
    }
}