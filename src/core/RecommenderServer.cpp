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
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
       // perror("error creating socket");
        return;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        //perror("error binding socket");
        return;
    }

    if (listen(serverSocket, 5) < 0) {
        //perror("error listening");
        return;
    }

    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);

        int client_sock = accept(serverSocket, (struct sockaddr *)&client_sin, &addr_len);
        if (client_sock >= 0) {
            handleClient(client_sock);
            close(client_sock);
        }       
    }
}

void RecommenderServer::handleClient(int clientSocket) {
    auto input = std::make_shared<SocketInput>(clientSocket);
    auto output = std::make_shared<SocketOutput>(clientSocket);
    while (true) {
        std::string rawLine = input->readLine();
        std::vector<std::string> args = parseInput(rawLine);
        if (args.empty()) output->printLine("400 Bad Request");
        std::string commandName = to_lowers(args[0]);
        args.erase(args.begin()); 
        if (commandMap.find(commandName) != commandMap.end()) {
            commandMap[commandName]->execute(args, output);
        } 
        else {
            output->printLine("400 Bad Request");
        }
    }
}

void RecommenderSystem::registerCommands() {
    commandMap["post"] = std::make_shared<CmdPost>(storage);
    commandMap["patch"] = std::make_shared<CmdPatch>(storage);
    commandMap["delete"] = std::make_shared<CmdDelete>(storage);
    commandMap["help"] = std::make_shared<CmdHelp>(outputHandler);
    commandMap["get"] = std::make_shared<CmdGet>(storage);
}

std::vector<std::string> RecommenderSystem::parseInput(const std::string& rawLine) {
    std::vector<std::string> args;
    std::stringstream ss(rawLine);
    std::string word;
    for (char c : rawLine) {
        if(std::isspace(static_cast<unsigned char>(c)) && c != ' ' && c != '\n' && c != '\r') {
            return args;
        }
    }

    while (ss >> word) {
        args.push_back(word);
    }
    return args;
}