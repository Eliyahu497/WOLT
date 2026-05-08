#ifndef ISTORAGE_H
#define ISTORAGE_H

#include <string>
#include <vector>
#include <unordered_map>

class IStorage {
public:
    virtual ~IStorage() = default;

    virtual void addViews(const std::string& userId, const std::vector<std::string>& productIds) = 0;
    virtual std::unordered_map<std::string, std::vector<std::string>> fetchAllData() = 0;
    virtual bool loadData() = 0;

    /**
     * @brief Check if a user already exists in the system.
     * @param userId The unique identifier of the user.
     * @return true if the user exists, false otherwise.
     */
    virtual bool userExists(const std::string& userId) = 0;

    /**
     * @brief Remove specific product views for a given user.
     * @param userId The unique identifier of the user.
     * @param productIds A list of product IDs to be removed from the user's history.
     */
    virtual void removeViews(const std::string& userId, const std::vector<std::string>& productIds) = 0;
};

#endif // ISTORAGE_H