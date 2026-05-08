#include "FileStorage.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <algorithm>

FileStorage::FileStorage(const std::string& path) : filePath(path) {}

//Loads user view data from the text file into the in-memory unordered_map
bool FileStorage::loadData() {
    // Open file for reading
    std::ifstream file(filePath); 
    // Return false if file cannot be opened
    if (!file.is_open()) {
        return false; 
    }

    std::string line;
    while (std::getline(file, line)) { 
        // Read the file line by line
        std::stringstream ss(line);    
        // Use stringstream to parse the line
        std::string userId, productId;
        
        // Read the first word as userId
            if (ss >> userId) {
            while (ss >> productId) {
                data[userId].push_back(productId);
            }
        }
    }
    // Always close the file
    file.close(); 
    return true;
}

//Adds new product views for a specific user and persists the updated data to disk
void FileStorage::addViews(const std::string& userId, const std::vector<std::string>& productIds) {
    // Update the in-memory map
    for (const auto& pid : productIds) {
        //if productId is new add it
        if (std::find(data[userId].begin(), data[userId].end(), pid) == data[userId].end()) {
            data[userId].push_back(pid);
        }
        //data[userId].push_back(pid);

    }
    // Update the physical file to maintain persistence
    flushToFile();
}

//Internal helper to overwrite the storage file (in disk) with the current in-memory data.
void FileStorage::flushToFile() {
    // Open file for writing (overwrites content)
    std::ofstream file(filePath); 
    if (!file.is_open()) {
        std::cerr << "Error: Could not open file for writing at " << filePath << std::endl;
        return;
    }

    // Iterate over the map and save data in the format: "UserId Prod1 Prod2..."
    for (const auto& pair : data) {
        file << pair.first; // userId
        for (const auto& pid : pair.second) {
            file << " " << pid;
        }
        file << "\n"; // End of line
    }
    file.close();
}

//Retrieves the entire dataset currently held in memory
std::unordered_map<std::string, std::vector<std::string>> FileStorage::fetchAllData() {
    return data;
}

/**
 * @brief Checks if the user exists in the in-memory 'data' map.
 */
bool FileStorage::userExists(const std::string& userId) {
    // We check our O(1) in-memory cache instead of reading the disk
    return data.find(userId) != data.end();
}

/**
 * @brief Removes specific product views for a user and rewrites the database file.
 */
void FileStorage::removeViews(const std::string& userId, const std::vector<std::string>& productIds) {
    auto it = data.find(userId);
    
    // If the user is not found, there is nothing to remove
    if (it == data.end()) {
        return;
    }

    // Get a reference to the user's actual product list in memory (no copies)
    std::vector<std::string>& userProducts = it->second;

    for (const std::string& pid : productIds) {
        // Erase-Remove Idiom: 
        // std::remove shifts matching elements to the end of the vector.
        // vector.erase physically shrinks the size of the vector.
        userProducts.erase(
            std::remove(userProducts.begin(), userProducts.end(), pid),
            userProducts.end()
        );
    }

    // Update the physical database.txt file to keep the deletion persistent
    flushToFile();
}