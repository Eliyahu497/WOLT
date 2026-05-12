#ifndef CMDGET_H // שינוי ה-Guard לשם החדש
#define CMDGET_H

#include <memory>
#include <vector>
#include <string>
#include "../interfaces/ICommand.h"
#include "../recommendation/RecommendationEngine.h"
#include "../interfaces/IStorage.h"
#include "../interfaces/IOutputHandler.h"

// שינוי השם ל-CmdGet
class CmdGet : public ICommand {
private:
    // שים לב: משתמשים ב-shared_ptr כדי להתאים ל-UML ולניהול זיכרון מודרני
    std::shared_ptr<IStorage> storage;
    RecommendationEngine engine;

public:
    // הבנאי מקבל רק את מה שקבוע (ה-Storage)
    CmdGet(std::shared_ptr<IStorage> storage);
    
    // ה-Output מגיע רק כאן, בזמן הביצוע!
    void execute(const std::vector<std::string>& args, std::shared_ptr<IOutputHandler> output) override;
};

#endif