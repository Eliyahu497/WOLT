# Wolt Recommendation System (CLI)

This project is a high-performance C++ command-line interface (CLI) application designed to manage user product history and provide personalized product recommendations. It utilizes user product history to identify similarities between users and suggest relevant items based on it.

---

## Architecture & Design Principles

The system was developed following **SOLID principles** and **Loose Coupling** to ensure the codebase remains maintainable, testable, and easily extensible.

### Design Patterns Used:

**Command Pattern:** Every system action (e.g., `add`, `recommend`, `help`) is encapsulated within its own class inheriting from the `ICommand` interface. This allows adding new commands without modifying existing code.

**Repository Pattern:** Data persistence is abstracted via the `IStorage` interface. The `FileStorage` implementation handles file I/O, allowing the storage layer to be swapped for a database without affecting business logic.

**Dependency Injection:** High-level modules receive their dependencies (Storage, Input, Output handlers) through constructors, facilitating easier unit testing and configuration.

**Strategy Pattern:** The recommendation logic is encapsulated in the `RecommendationEngine`, allowing algorithm updates independently of the CLI interface.

---

## Project Structure

- `src/commands/` — Contains the logic for specific CLI commands (`CmdAdd`, `CmdRecommend`, `CmdHelp`).
- `src/core/` — The system's backbone, managing command registration and execution (`RecommenderSystem`).
- `src/recommendation/` — Implementation of the similarity and recommendation algorithms (`RecommendationEngine`).
- `src/repository/` — Handles persistent data storage and retrieval (`FileStorage`).
- `src/interfaces/` — Abstract interfaces defining the contract for all system components.
- `data/` — Directory containing the persistent `database.txt` file.
- `test/` — Unit and integration tests powered by **Google Test (GTest)**.

---

## Docker Instructions

**Build the image:**
```powershell
docker build -t wolt-recommender .
```

**Run with persistent storage (PowerShell):**
```powershell
docker run -it --rm -v "${PWD}/data:/app/data" wolt-recommender ./build/wolt_recommender_app
```

**Run with persistent storage (CMD):**
```cmd
docker run -it --rm -v "%cd%/data:/app/data" wolt-recommender ./build/wolt_recommender_app
```

**Run automated tests:**
```powershell
docker run --rm wolt-recommender ./build/recommender_tests
```

---

## Program Usage & Commands

The application runs in a continuous interactive loop and supports the following commands:

**1. Add:**
```
add [userId] [productId1] [productId2] ...
```
Associates one or more products with a specific user. Data is automatically persisted to `data/database.txt`.

**2. Recommend:**
```
recommend [userId] [productId]
```
Suggests relevant products based on the similarity between the target user and others who viewed the same product. Returns a space-separated list of product IDs (e.g., `105 106 111`). If no recommendations are available or the input is invalid, the command produces no output.

**3. Help:**
```
help
```
Displays the help menu with all available commands and their usage.

---

## Technical Notes

- **Memory Management:** The system utilizes smart pointers (`std::shared_ptr`) for safe and efficient resource management.
- **Persistence:** The `FileStorage` class uses `std::ios_base::app` to append new user data without overwriting the existing database.