#ifndef FILESTORAGE_H
#define FILESTORAGE_H

#include "../interfaces/IStorage.h"
#include <string>
#include <vector>
#include <unordered_map>

/**
 * @brief Implementation of the IStorage interface using local file persistence.
 * * This class handles the storage of user view history by maintaining an in-memory 
 * cache (unordered_map) and synchronizing it with a local text file to ensure 
 * data persistence.
 */
class FileStorage : public IStorage {
private:
    std::string filePath; // The path to the database file on disk

    // In-memory cache for fast O(1) access to user view history
    std::unordered_map<std::string, std::vector<std::string>> data;

    /**
     * @brief Internal helper to write the current in-memory data to the physical file.
     * This ensures that any changes in memory are reflected on the disk.
     */
    void flushToFile();

public:
    /**
     * @brief Construct a new File Storage object.
     * @param path The filesystem path to the database text file.
     */
    FileStorage(const std::string& path);

    /**
     * @brief Adds new products to a user's history and persists the changes to disk.
     * @param userId The unique identifier of the user.
     * @param productIds A vector containing the product IDs the user has viewed.
     */
    void addViews(const std::string& userId, const std::vector<std::string>& productIds) override;
    
    /**
     * @brief Retrieves the entire dataset currently held in memory.
     * @return An unordered_map where keys are user IDs and values are vectors of product IDs.
     */
    std::unordered_map<std::string, std::vector<std::string>> fetchAllData() override;
    
    /**
     * @brief Loads existing data from the database file into memory.
     * @return true if the data was successfully loaded, false if the file could not be opened.
     */
    bool loadData() override;

    /**
     * @brief Check if a user already exists in the system.
     * @param userId The unique identifier of the user.
     * @return true if the user exists in memory, false otherwise.
     */
    bool userExists(const std::string& userId) override;

    /**
     * @brief Remove specific product views for a given user.
     * @param userId The unique identifier of the user.
     * @param productIds A list of product IDs to be removed from the user's history.
     */
    void removeViews(const std::string& userId, const std::vector<std::string>& productIds) override;
};

#endif // FILESTORAGE_H