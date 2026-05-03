#pragma once
#include <string>
#include <vector>
#include <unordered_map>

class IStorage {
public:
    virtual ~IStorage() = default;

    virtual void addViews(const std::string& userId, const std::vector<std::string>& productIds) = 0;
    virtual std::unordered_map<std::string, std::vector<std::string>> fetchAllData() = 0;
    virtual bool loadData() = 0;
};