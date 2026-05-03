# =========================================================
# 1. Basic Project Settings
# =========================================================
cmake_minimum_required(VERSION 3.14)

# Renamed the project to reflect its specific role within the larger WOLT system
project(WoltRecommender CXX)

# Require C++17 standard (needed for modern C++ features and GoogleTest)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# =========================================================
# 2. Include Directories
# =========================================================
# Allow simple #include directives for header files in the interfaces directory
include_directories(
    src/interfaces
    src/repository
    src/core
    src/io
    src/commands
    src/recommendation
)

# =========================================================
# 3. Core Logic Library
# =========================================================
# Package all cpp files (except main.cpp) into a single static library.
# This allows both the main app and the tests to share the same logic.
add_library(recommender_core
    src/core/RecommenderSystem.cpp    
    src/io/TerminalInput.cpp        
    src/io/TerminalOutput.cpp
    src/repository/FileStorage.cpp          
    src/commands/CmdAdd.cpp               
    src/commands/CmdRecommend.cpp
    src/commands/CmdHelp.cpp
    src/recommendation/RecommendationEngine.cpp 
)

# Enable compiler warnings to help maintain clean code and prevent bugs
target_compile_options(recommender_core PRIVATE -Wall -Wextra -Wpedantic)

# =========================================================
# 4. Main Application Executable
# =========================================================
# Changed the executable name slightly to match the project context
add_executable(wolt_recommender_app src/main.cpp)

# Link the main executable to our core logic library
target_link_libraries(wolt_recommender_app PRIVATE recommender_core)

# =========================================================
# 5. Google Test Setup (Official Skeleton)
# =========================================================
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# =========================================================
# 6. Testing Environment & Test Executable
# =========================================================
enable_testing()

# Create a dedicated executable for running the tests (Updated with new test files)
add_executable(recommender_tests 
    tests/test_commands.cpp
    tests/test_repository.cpp
    tests/test_algorithm.cpp
)

# Link the tests to our core logic and the gtest_main library
target_link_libraries(recommender_tests PRIVATE recommender_core GTest::gtest_main)

# Automatically discover tests so they can be run using the 'ctest' command
include(GoogleTest)
gtest_discover_tests(recommender_tests)