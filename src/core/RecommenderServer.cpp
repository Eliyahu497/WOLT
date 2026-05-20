#include "RecommenderServer.h"
#include <sstream>
#include "IInputHandler.h"
#include "IOutputHandler.h"
#include "CmdGet.h"
#include "CmdHelp.h"
#include "CmdPost.h"
#include "CmdPatch.h"
#include "CmdDelete.h"
#include <sys/socket.h>
#include <sys/socket.h>
#include <cstring>
#include <netinet/in.h>
#include <unistd.h>
#include <arpa/inet.h>
#include "../network/SocketInput.h"
#include "../network/SocketOutput.h"
#include <algorithm>
/**
 * @brief Constructs a new Recommender System object and registers available commands.
 * 
 * @param input A shared pointer to the input handler (used to read user commands).
 * @param output A shared pointer to the output handler (used to display messages/results).
 * @param store A shared pointer to the storage interface (used to save and load data).
 */
RecommenderServer::RecommenderServer(int port, std::shared_ptr<IStorage> storage) 
    : port(port), storage(storage) {
    registerCommands();
}

void RecommenderServer::start() {
    // Create a TCP socket
    ServerSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (ServerSocket < 0) {
       // perror("error creating socket");
        return;
    }
    // Configure server address structure
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);
    // Bind the socket to the specified port
    if (bind(ServerSocket, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        //perror("error binding socket");
        return;
    }
    // Start listening for incoming connections (queue size up to 5)
    if (listen(ServerSocket, 5) < 0) {
        //perror("error listening");
        return;
    }
    // Main server loop: wait for and accept clients
    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        // Block until a new client connects
        int client_sock = accept(ServerSocket, (struct sockaddr *)&client_sin, &addr_len);
        if (client_sock >= 0) {
            // Process client requests, then safely close the connection
            handleClient(client_sock);
            close(client_sock);
        }       
    }
}
// Helper function to convert a string to lowercase
std::string to_lowers(std::string str) {
    std::transform(str.begin(), str.end(), str.begin(), ::tolower);
    return str;
}
void RecommenderServer::handleClient(int clientSocket) {
    // Wrap the raw socket with input and output handlers
    auto input = std::make_shared<SocketInput>(clientSocket);
    auto output = std::make_shared<SocketOutput>(clientSocket);
    try {
    // Read and process commands continuously until the client disconnects
    while (true) {
        std::string rawLine = input->readLine();
        std::vector<std::string> args = parseInput(rawLine);
        // Check if input is empty or invalid
        if (args.empty()) {
            output->printLine("400 Bad Request");
            continue;
        }
        // Make command case-insensitive (e.g., "GET" -> "get")
        std::string commandName = to_lowers(args[0]);
        args.erase(args.begin()); 
        // Execute the command if it exists in the map
        if (commandMap.find(commandName) != commandMap.end()) {
            commandMap[commandName]->execute(args, output);
        } 
        else {
            output->printLine("400 Bad Request");
        }
    } 
}
    catch (const std::exception& e) {
        // Handle client disconnection or other exceptions gracefully
        // For example, you can log the error message if needed
    }
}

void RecommenderServer::registerCommands() {
    // Map string commands to their respective class instances
    commandMap["post"] = std::make_shared<CmdPost>(storage);
    commandMap["patch"] = std::make_shared<CmdPatch>(storage);
    commandMap["delete"] = std::make_shared<CmdDelete>(storage);
    commandMap["help"] = std::make_shared<CmdHelp>();
    commandMap["get"] = std::make_shared<CmdGet>(storage);
}

std::vector<std::string> RecommenderServer::parseInput(const std::string& rawLine) {
    std::vector<std::string> args;
    std::stringstream ss(rawLine);
    std::string word;
    // Check for invalid whitespace characters (like tabs) and reject if found
    for (char c : rawLine) {
        if(std::isspace(static_cast<unsigned char>(c)) && c != ' ' && c != '\n' && c != '\r') {
            return args;
        }
    }
    // Split the input line into words by spaces
    while (ss >> word) {
        args.push_back(word);
    }
    return args;
}