#include <memory>
#include "RecommenderSystem.h"
#include "TerminalInput.h"
#include "TerminalOutput.h"
#include "FileStorage.h"
int main() {
    auto inputHandler = std::make_shared<TerminalInput>();
    auto outputHandler = std::make_shared<TerminalOutput>();
    auto storage = std::make_shared<FileStorage>("data/database.txt");
    RecommenderSystem app(inputHandler, outputHandler, storage);
    app.start();
    return 0;
}