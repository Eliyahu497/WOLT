#ifndef VALIDATION_UTILS_H
#define VALIDATION_UTILS_H

#include <string>
#include <vector>
#include <cctype>

namespace utils {

    /**
     * @brief Validates if a string represents a valid product ID (non-empty and contains no whitespace).
     */
    inline bool isValidProductId(const std::string& str) {
        if (str.empty()) return false;
        for (char c : str) {
            if (std::isspace(static_cast<unsigned char>(c))) {
                return false;
            }
        }
        return true;
    }

    /**
     * @brief Validates the basic syntax of a write command (POST/PATCH/DELETE).
     * Ensures at least a UserId and one ProductId are present, and all product IDs are valid string IDs (non-empty, no whitespace).
     */
    inline bool validateWriteArguments(const std::vector<std::string>& args) {
        if (args.size() < 2) {
            return false;
        }
        for (size_t i = 1; i < args.size(); ++i) {
            if (!isValidProductId(args[i])) {
                return false;
            }
        }
        return true;
    }
}

#endif // VALIDATION_UTILS_H