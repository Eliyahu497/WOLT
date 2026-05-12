#include <memory>
#include "RecommenderServer.h"
#include "TerminalInput.h"
#include "TerminalOutput.h"
#include "FileStorage.h"
#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        return 1;}

    int port = std::stoi(argv[1]);
    auto storage = std::make_shared<FileStorage>("data/database.txt");
    storage->loadData();
    RecommenderServer app(port, storage);
    app.start();
    return 0;
}