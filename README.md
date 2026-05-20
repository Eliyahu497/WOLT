# Wolt Recommendation System (TCP Client-Server Architecture)

This project is a high-performance C++ and Python 3 distributed application designed to manage user product history and provide personalized product recommendations over a custom TCP socket protocol. The system is split into a robust C++ Business Logic Server and a lightweight, interactive Python 3 Client.

---

## Architecture & Design Principles

The architecture strictly adheres to **SOLID principles** and **Loose Coupling**, ensuring that the system is safe, testable, and easily extensible for future assignments.

### Design Patterns & Advanced Architecture Used:


- **Command Pattern:** Every system action (`POST`, `PATCH`, `DELETE`, `GET`, `help`) is encapsulated within its own isolated class implementing the `ICommand` interface. This allows introducing new commands without modifying existing logic or infrastructure.

- **Repository Pattern:** Core data persistence is abstracted via the `IStorage` interface. The system uses a centralized file persistence mechanism that automatically synchronizes network state to disk while protecting database integrity.

- **Dependency Injection:** High-level controller modules receive their dependencies (Storage, Network I/O Handlers) via constructors, which facilitates clean simulation in automated TDD environments using Mocks.

- **Strategy Pattern:** The recommendation logic is encapsulated in the `RecommendationEngine`, allowing algorithm updates independently of the CLI interface.

- **Stateless Syntactic Validation Pipeline (`ValidationUtils`):** To preserve **Single Responsibility (SRP)** and avoid tight coupling, all syntactic validation logic (length checks, parsing integers, and checking for numeric boundaries) is offloaded to a stateless, inline utility layer. This layer prevents garbage data from reaching the repository and ensures that syntactic failures fail fast, generating immediate protocol errors.

---

## Reflection: Open/Closed Principle (OCP) Compliance

Architectural reflection regarding the transition from Exercise 1 to Exercise 2:

1. **Changing Command Names (e.g., `add` to `POST`, `recommend` to `GET`):** Our system was fully closed to modification and open to expansion here. Because the `RecommenderServer` maps command keywords dynamically to `ICommand` shared pointers using an internal associative map (`std::unordered_map`), updating the protocol names did not require changing any existing command code. We simply updated the registration strings inside the server setup.
   
2. **Adding New Commands (`PATCH`, `DELETE`):** Completely OCP-compliant. Implementing `PATCH` and `DELETE` required zero modifications to the core server framework or other existing commands. We simply introduced `CmdPatch` and `CmdDelete` as new concrete extensions of `ICommand`.
   
3. **Changing the Input/Output Medium (Console to TCP Sockets):** Thanks to the abstraction of I/O via `IInputHandler` and `IOutputHandler` in Exercise 1, our business commands were totally isolated from network details. Transitioning to sockets only required writing concrete `SocketInput` and `SocketOutput` decorators. The core system remained completely unchanged.
   
4. **Concurrently Handling Multiple Clients in the Future:** Our business logic components and commands are stateless per execution, depending strictly on thread-safe abstractions. Transitioning the system to a multi-threaded architecture (e.g., thread-per-client or thread pool) will only alter the connection dispatching loop in `RecommenderServer`, keeping the underlying command engine closed to modification.

---

## Project Structure

- `src/commands/` — Contains isolated protocol commands (`CmdPost`, `CmdPatch`, `CmdDelete`, `CmdGet`, `CmdHelp`).
- `src/core/` — The system's central TCP controller managing client connections and routing.
- `src/client/` — The interactive client interface written in Python 3 (`client.py`).
- `src/utils/` — Shared validation mechanics (`ValidationUtils.h`) ensuring atomic constraint compliance.
- `src/interfaces/` — Pure virtual contracts separating implementation details from system dependencies.
- `data/` — Persistent environment directory containing the synchronized `database.txt` file.
- `test/` — Full automated unit and integration suite implemented using **Google Test (GTest)** under strict **TDD** guidelines.

---

## Docker & Execution Instructions

This project is fully containerized, enabling isolated execution of the server, client, and automated unit test suite.

### 1. Build the Unified Docker Image
Run the following command in the project root directory:
```bash
docker build -t wolt-recommender .
```


### 2. Run Automated Unit Tests (GTest Suite)
To verify that all TDD test suites are passing perfectly:

```bash
docker run --rm wolt-recommender ./build/recommender_tests
```

### 3. Running the Live Application (Interactive Mode)
The architecture operates over a distributed TCP socket environment. You must use two separate terminals.

Step A:
Boot the C++ Server (Terminal 1)
Launch the server container with volume mounting for data persistence and forward the chosen port (e.g., 8080):
```bash
docker run -it --rm -p 8080:8080 -v "${PWD}/data:/app/data" wolt-recommender ./build/wolt_recommender_app 8080
```
Step B:
 Launch the Python Client (Terminal 2)
Open a new terminal window on your machine, navigate to the project directory, and run the client script by providing the server's IP address and Port:

```bash
python3 src/client/client.py 127.0.0.1 8080
```

---

### Program Protocol & Supported Commands

Once connected via the client console, the server enforces strict input structural rules:

**1. DELETE (Remove Product Views):**
```
DELETE [userid] [productid1] [productid2] ...
```
Success Response: 204 No Content

Failure: Returns 404 Not Found if the user or any requested product view does not exist. Enforces atomic validation (all or nothing).

**2. GET (Personalized Recommendation):**
```
GET [userid] [productid]
```
Success Response: 200 Ok\n\n[space-separated recommended product IDs]

Failure: Returns 404 Not Found if the user is missing.

**3. PATCH (Append Views):**
```
PATCH [userid] [productid1] [productid2] ...
```
Success Response: 204 No Content

Failure: Returns 404 Not Found if the user doesn't exist, or 400 Bad Request on invalid syntax.

**4. POST (Create User Profile):**
```
POST [userid] [productid1] [productid2] ...
```
Success Response: 201 Created

Failure: Returns 400 Bad Request if the syntax is malformed or if the user already exists.

**5. Help:**
```
help
```
Returns all active write/read operations sorted in alphabetical order, detailing required protocol arguments.

---

## Technical Notes

- **Memory Management:** The system strictly utilizes modern C++ smart pointers (`std::shared_ptr`) to maintain safe lifecycle management, prevent memory leaks, and guarantee proper resource cleanup across distributed session handlers.

- **State Persistence & Synchronization:** The storage layer abstracts file I/O operations through the centralized `FileStorage` repository. Rather than blindly appending entries, data synchronization routines dynamically serialize in-memory state changes (including view updates from `PATCH` and profile reductions from `DELETE`) back to `data/database.txt`, maintaining strict state consistency with minimal overhead.
